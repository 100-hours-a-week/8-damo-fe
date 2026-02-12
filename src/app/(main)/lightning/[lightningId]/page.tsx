import { getAccessToken } from "@/src/lib/cookie";
import { redirect } from "next/navigation";
import { LightningChatClient } from "@/src/components/lightning/chat/lightning-chat-client";

interface Props {
  params: Promise<{
    lightningId: string;
  }>;
}

export default async function LightningChatPage({
  params,
}: Props) {
  const { lightningId } = await params;
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh flex-col">
      <LightningChatClient
        lightningId={lightningId}
        accessToken={accessToken}
      />
    </div>
  );
}
