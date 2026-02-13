  import type { Client } from "@stomp/stompjs";
  import { createStompClient } from "./stomp-client-factory";
  import type {
    MessageHandler,
    SubscriptionDef,
    SubscriptionKey,
  } from "./type";

  function isSafeToUseClient(client: Client | null): client is Client {
    return !!client && client.active && client.connected;
  }

  interface SocketManagerOptions {
    brokerURL: string | undefined;
    reconnectDelay?: number;
    debug?: boolean;
  }

  export class SocketManager {
    private brokerURL: string | undefined;
    private reconnectDelay: number;
    private debug: boolean;

    private client: Client | null = null;
    private token: string | null = null;
    private generation = 0;

    private registry = new Map<SubscriptionKey, SubscriptionDef>();
    private deactivating: Promise<void> | null = null;

    constructor(opts: SocketManagerOptions) {
      this.brokerURL = opts.brokerURL;
      this.reconnectDelay = opts.reconnectDelay ?? 5000;
      this.debug = opts.debug ?? false;
    }

    setBrokerURL() {
      this.brokerURL = process.env.NEXT_PUBLIC_BROKER_URL;
    }

    snapshot() {
      return {
        token: this.token ? `${this.token.slice(0, 8)}...` : null,
        generation: this.generation,
        active: this.client?.active ?? false,
        connected: this.client?.connected ?? false,
        keys: Array.from(this.registry.keys()),
      };
    }

    async connect(accessToken: string): Promise<void> {
      if (!this.brokerURL) {
        this.log("connect ignored: brokerURL missing");
        return;
      }

      if (this.token === accessToken && this.client?.active) {
        this.log("connect ignored: same token & active");
        return;
      }

      if (this.deactivating) {
        this.log("connect waiting: deactivating in progress");
        await this.deactivating;
        this.deactivating = null;
      }

      if (this.client) {
        await this.disconnect();
      }

      this.token = accessToken; 
      this.generation += 1; 
      const currentGen = this.generation; 
      this.log("connect start", { generation: currentGen });

      const client = createStompClient({
        brokerURL: this.brokerURL,
        accessToken,
        reconnectDelay: this.reconnectDelay,
        debug: this.debug,
        onConnect: (connectedClient) => {
          this.log("onConnect", this.snapshot());

          if (this.generation !== currentGen) {
             this.log("onConnect ignored: generation mismatch", 
              { 
                expected: currentGen,
                actual: this.generation, 
              }); 
              return; 
          }

          this.client = connectedClient;
          this.restoreAllSubscriptions();
        },
        onWebSocketClose: (evt) => {
          this.log("onWebSocketClose", { code: evt.code, reason: evt.reason });
        },
        onStompError: (frame) => {
          this.log("onStompError", frame);
        },
      });

      this.client = client;
      client.activate();
    }

    async disconnect(): Promise<void> {
      const client = this.client;
      this.token = null;

      if (!client) return;

      if (this.deactivating) {
        await this.deactivating;
        return;
      }

      this.log("disconnect start", this.snapshot());

      const p = (async () => {
        try {
          await client.deactivate();
        } catch (error) {
          this.log("disconnect error", error);
        } finally {
          this.client = null;
          this.log("disconnect done");
        }
      })();

      this.deactivating = p;
      await p;
      this.deactivating = null;
    }

    subscribe(key: SubscriptionKey, destination: string, handler: MessageHandler) {
      const def: SubscriptionDef = {
        destination,
        handler,
        sub: undefined,
        generation: this.generation,
      };

      const prev = this.registry.get(key);
      if (prev?.sub && isSafeToUseClient(this.client)) {
        try {
          prev.sub.unsubscribe();
        } catch {
        }
      }

      this.registry.set(key, def);

      if (isSafeToUseClient(this.client)) {
        this.attachSubscription(key);
      } else {
        this.log("subscribe queued", { key, destination });
      }
    }

    unsubscribe(key: SubscriptionKey) {
      const def = this.registry.get(key);
      if (!def) return;

      this.registry.delete(key);

      if (def.sub && isSafeToUseClient(this.client)) {
        try {
          def.sub.unsubscribe();
        } catch {
        }
      }

      this.log("unsubscribe", { key });
    }

    publish(destination: string, body: string) {
      const client = this.client;
      if (!isSafeToUseClient(client)) {
        throw new Error("Socket not connected");
      }

      client.publish({ destination, body });
    }

    private restoreAllSubscriptions() {
      for (const key of this.registry.keys()) {
        this.attachSubscription(key);
      }
    }

    private attachSubscription(key: SubscriptionKey) {
      const client = this.client;
      const def = this.registry.get(key);

      if (!def || !isSafeToUseClient(client)) return;
      if (def.sub && def.generation === this.generation) return;

      try {
        const sub = client.subscribe(def.destination, def.handler);
        def.sub = sub;
        def.generation = this.generation;
        this.registry.set(key, def);

        this.log("subscribed", { key, destination: def.destination });
      } catch (error) {
        this.log("subscribe failed", { key, error });
      }
    }

    private log(message: string, extra?: unknown) {
      if (!this.debug) return;
      console.log(`[SocketManager] ${message}`, extra ?? "");
    }
  }

  export const socketManager = new SocketManager({
    brokerURL: process.env.NEXT_PUBLIC_BROKER_URL ?? undefined,
    reconnectDelay: 5000,
    debug: true,
  });
