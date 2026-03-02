"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState("");

  const canSend = value.trim().length > 0 && !disabled;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="bg-background px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="메시지를 입력하세요"
          disabled={disabled}
          className="h-10 rounded-full border-0 bg-card px-4 text-base shadow-none focus-visible:ring-2"
        />

        <Button
          type="submit"
          onMouseDown={(e) => e.preventDefault()}
          size="icon"
          disabled={!canSend}
          className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-input disabled:text-muted-foreground"
          aria-label="메시지 전송"
        >
          <Send className="size-5" />
        </Button>
      </form>
    </div>
  );
}
