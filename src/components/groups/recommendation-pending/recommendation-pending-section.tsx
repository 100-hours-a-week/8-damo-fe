"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DiningSummaryCard } from "@/src/components/groups/detail/dining-summary-card";
import { getGroupDiningSummaries } from "@/src/lib/api/client/dining";
import type { DiningSummary } from "@/src/types/api/dining";

const POLLING_INTERVAL_MS = 3_000;
const POLLING_MAX_DURATION_MS = 180_000;
const MESSAGE_ROTATE_INTERVAL_MS = 2_500;
const TRANSITION_DURATION_MS = 500;

const ROTATING_MESSAGES = [
  "맛있는 곳 열심히 찾는 중이에요 🍜",
  "모두의 취향을 놓치지 않고 있어요 👀",
  "이번 회식, 실패 없는 선택을 고민 중 🤔",
  "회식 장소 고민은 Damo가 할게요 ✨",
];

const EXTENDED_MESSAGES = [
  ...ROTATING_MESSAGES,
  ROTATING_MESSAGES[0], // 핵심
];

interface RecommendationPendingSectionProps {
  groupId: string;
}

export function RecommendationPendingSection({
  groupId,
}: RecommendationPendingSectionProps) {
  const router = useRouter();
  const [pendingDinings, setPendingDinings] = useState<DiningSummary[]>([]);
  const [isExpired, setIsExpired] = useState(false);

  const [messageIndex, setMessageIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const expireRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------------- polling ---------------------- */

  useEffect(() => {
    let alive = true;

    const stopAll = () => {
      pollingRef.current && clearInterval(pollingRef.current);
      expireRef.current && clearTimeout(expireRef.current);
      messageRef.current && clearInterval(messageRef.current);
    };

    const fetchPending = async (): Promise<boolean> => {
      try {
        const res = await getGroupDiningSummaries(
          groupId,
          "RECOMMENDATION_PENDING"
        );

        if (!alive) return false;

        const data = res.data ?? [];

        if (
          data.length === 0 ||
          data.some((d) => d.status !== "RECOMMENDATION_PENDING")
        ) {
          setPendingDinings([]);
          stopAll();
          return false;
        }

        setPendingDinings(data);
        return true;
      } catch {
        return false;
      }
    };

    const startPolling = () => {
      pollingRef.current = setInterval(fetchPending, POLLING_INTERVAL_MS);
      expireRef.current = setTimeout(() => {
        if (alive) setIsExpired(true);
      }, POLLING_MAX_DURATION_MS);
    };

    const startMessageRotation = () => {
      messageRef.current = setInterval(() => {
        setEnableTransition(true);
        setMessageIndex((prev) => prev + 1);
      }, MESSAGE_ROTATE_INTERVAL_MS);
    };

    (async () => {
      const hasPending = await fetchPending();
      if (alive && hasPending) {
        startPolling();
        startMessageRotation();
      }
    })();

    return () => {
      alive = false;
      stopAll();
    };
  }, [groupId]);

  /* ------------------ message reset ------------------ */

  useEffect(() => {
    if (messageIndex === ROTATING_MESSAGES.length) {
      const id = setTimeout(() => {
        setEnableTransition(false); // transition OFF
        setMessageIndex(0);
      }, TRANSITION_DURATION_MS);

      return () => clearTimeout(id);
    }
  }, [messageIndex]);

  /* ---------------------- render ---------------------- */

  if (pendingDinings.length === 0) return null;

  const handleDiningClick = (diningId: string) => {
    router.push(`/groups/${groupId}/dining/${diningId}`);
  };

  return (
    <section className="flex flex-col gap-4 px-4 pt-4 sm:px-5">
      <div className="rounded-xl bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#333]">
          <div className="relative h-5 overflow-hidden">
            <div
              className={`flex flex-col ${
                enableTransition
                  ? "transition-transform duration-1200 ease-out"
                  : ""
              }`}
              style={{
                transform: `translateY(-${messageIndex * 1.25}rem)`,
              }}
            >
              {EXTENDED_MESSAGES.map((msg, i) => (
                <span key={`${msg}-${i}`} className="block h-5 leading-5">
                  {msg}
                </span>
              ))}
            </div>
          </div>

          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:600ms]" />
          </span>
        </div>

        <p className="mt-1 text-xs text-[#8e8e93]">
          {isExpired
            ? "추천이 예상보다 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요."
            : "잠시만 기다려주세요."}
        </p>

        <div className="flex flex-col">
          {pendingDinings.map((dining, index) => {
            const isLast = index === pendingDinings.length - 1;

            return (
              <div key={dining.diningId} className="flex flex-col">
                <DiningSummaryCard
                  date={dining.diningDate}
                  attendeeCount={dining.diningParticipantsCount}
                  status={dining.status}
                  onClick={() => handleDiningClick(String(dining.diningId))}
                />

                {!isLast && (
                  <div className="my-4 h-px bg-[#e5e5ea]" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
