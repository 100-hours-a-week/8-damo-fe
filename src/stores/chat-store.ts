import { create } from "zustand";
import { ChatBroadcastMessage } from "../types/chat";

interface ChatStore {
  messages: Record<string, ChatBroadcastMessage[]>;
  previews: Record<string, ChatBroadcastMessage>;
  unread: Record<string, number>;

  addMessage: (message: ChatBroadcastMessage) => void; 
  markAsRead: (lightningId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {}, 
  previews: {}, 
  unread: {}, 

  addMessage: (message) => {
    const {lightningId} = message;
    const state = get();

    const roomMessages = state.messages[lightningId] ?? []; 

    set({
      messages: {
        ...state.messages, 
        [lightningId]: [...roomMessages, message],
      }, 
      previews: {
        ...state.previews, 
        [lightningId]: message
      }, 
      unread: {
        ...state.unread, 
        [lightningId]: (state.unread[lightningId] ?? 0) + 1, 
      },
    });
  },

  markAsRead: (lightningId) => {
    set((state) => ({
      unread: {
        ...state.unread, 
        [lightningId]: 0,
      }
    }))
  }
}));