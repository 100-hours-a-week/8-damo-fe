import { SectionCard } from "@/src/components/ui/section-card";
import { LightningParticipant } from "@/src/types/lightning";
import { ParticipantAvatar } from "./participant-avatar";

interface LightningDetailParticipantListSectionProps {
  maxParticipants: number;
  currentParticipants: number;
  participants: LightningParticipant[];
}

export function LightningDetailParticipantListSection({
  maxParticipants,
  currentParticipants,
  participants
}: LightningDetailParticipantListSectionProps) {
  const remainingSeats = Math.max(0, maxParticipants - currentParticipants);

  return (
    <section className="mt-6">
      <SectionCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#111111]">
            참여자 {currentParticipants}명
          </h2>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {participants.map((participant) => (
            <ParticipantAvatar
              key={participant.id}
              src={participant.avatarUrl}
              nickname={participant.nickname}
            />
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
