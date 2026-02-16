export function ChatUnreadDivider() {
  return (
    <li className="relative my-3 flex items-center justify-center">
      <div className="absolute inset-x-0 h-px bg-border" />
      <span className="relative z-10 rounded-full bg-background px-3 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-sm">
        여기까지 읽으셨어요
      </span>
    </li>
  );
}
