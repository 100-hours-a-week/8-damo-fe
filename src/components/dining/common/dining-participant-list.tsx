import { Avatar } from "@/src/components/ui/avatar";

export interface Participant {
  userId: number;
  nickname: string;
  imagePath: string;
}

interface DiningParticipantListProps {
  participants: Participant[];
}

const PERSON_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d1d1d6">
  <circle cx="12" cy="8" r="4" />
  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
</svg>
`);

export function DiningParticipantList({
  participants,
}: DiningParticipantListProps) {
  return (
    <section className="w-full rounded-[20px] bg-white p-5">
      <h2 className="mb-4 text-lg font-bold leading-6 text-[#101828]">
        회식 참석자 ({participants.length}명)
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {participants.map((participant) => (
          <div
            key={participant.userId}
            className="flex flex-col items-center gap-2 rounded-[14px] border border-[#e5e7eb] py-4"
          >
            <Avatar
              src={`https://${process.env.NEXT_PUBLIC_S3_CDN}/${participant.imagePath}`}
              alt={`${participant.nickname} 프로필`}
              fallbackUrl={PERSON_FALLBACK_IMAGE}
              size="sm"
              showBorder={false}
              className="bg-[#f2f2f7]"
            />
            <span className="text-sm font-semibold leading-5 text-[#101828]">
              {participant.nickname}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
