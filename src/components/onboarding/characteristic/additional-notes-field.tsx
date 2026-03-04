import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

const MAX_LENGTH = 100;

interface AdditionalNotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showLabel?: boolean;
  error?: string;
}

export function AdditionalNotesField({
  value,
  onChange,
  disabled,
  showLabel = true,
  error,
}: AdditionalNotesFieldProps) {
  const isMaxLength = value.length >= MAX_LENGTH;

  return (
    <div className="flex flex-col gap-3">
      {showLabel && (
        <Label className="text-lg font-bold text-foreground">
          추가적으로 전달하고 싶은 내용이 있나요?
        </Label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예) 매운 음식은 잘 못 먹어요."
        disabled={disabled}
        maxLength={MAX_LENGTH}
        className="min-h-[100px] rounded-lg border-none bg-muted px-4 py-4 text-base font-semibold placeholder:text-muted-foreground"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p
        className={cn(
          "text-sm text-muted-foreground",
          isMaxLength && "text-destructive"
        )}
      >
        {value.length}/{MAX_LENGTH}
      </p>
    </div>
  );
}
