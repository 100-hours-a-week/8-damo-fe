"use client";

import { useRouter } from "next/navigation";

interface ReceiptApprovedSectionProps {
  groupId: string;
  diningId: string;
}

export function ReceiptApprovedSection({
  groupId,
  diningId,
}: ReceiptApprovedSectionProps) {
  const router = useRouter();

  return (
    <section className="flex w-full flex-col items-center gap-4 px-4 sm:px-5">
      <p className="text-center text-base font-medium text-gray-700">
        영수증이 승인되었어요
      </p>
      <button
        type="button"
        onClick={() => router.push(`/groups/${groupId}/dining/${diningId}/review`)}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
      >
        리뷰하러가기
      </button>
    </section>
  );
}
