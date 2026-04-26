"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface LoginPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  title?: string;
  description?: string;
}

export function LoginPromptModal({
  open,
  onOpenChange,
  onLogin,
  title = "로그인이 필요합니다",
  description = "초대받은 Damo 그룹에 참가하려면 카카오 로그인이 필요합니다.",
}: LoginPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="kakao"
            size="lg"
            className="h-12 w-full text-base font-semibold"
            onClick={onLogin}
          >
            카카오로 로그인
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 w-full text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            다음에 하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
