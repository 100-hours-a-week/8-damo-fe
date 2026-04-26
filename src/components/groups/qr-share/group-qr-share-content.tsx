"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Share2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "../../layout";
import { loadKakaoSDK } from "@/src/lib/kakao-sdk";

interface GroupQrShareContentProps {
  groupId: string;
  groupName: string;
}

export function GroupQrShareContent({ groupId, groupName }: GroupQrShareContentProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const kakaoButtonRef = useRef<HTMLButtonElement>(null);

  const shareImageUrl = `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/groups/share/preview.png`;
  const qrImageUrl = `https://${process.env.NEXT_PUBLIC_S3_CDN}/s3/images/groups/qr/${groupId}`;
  const previewUrl = `${process.env.NEXT_PUBLIC_API_URL}/groups/preview/${groupId}`;

  useEffect(() => {
    const initKakaoButton = async () => {
      try {
        await loadKakaoSDK();

        if (!window.Kakao?.Share || !kakaoButtonRef.current) {
          return;
        }

        window.Kakao.Share.createDefaultButton({
          container: kakaoButtonRef.current,
          objectType: "feed",
          content: {
            title: `${groupName} 그룹 초대`,
            description: "Damo 그룹에 참여하세요!",
            imageUrl: shareImageUrl,
            link: {
              mobileWebUrl: previewUrl,
              webUrl: previewUrl,
            },
          },
          buttons: [
            {
              title: "그룹 참여하기",
              link: {
                mobileWebUrl: previewUrl,
                webUrl: previewUrl,
              },
            },
          ],
        });

        setIsKakaoReady(true);
      } catch (error) {
        console.error("카카오 SDK 초기화 실패:", error);
        toast.error("카카오톡 공유 기능을 불러오지 못했습니다.");
      }
    };

    initKakaoButton();
  }, [groupName, previewUrl, qrImageUrl]);

  const handleBack = () => {
    router.push(`/groups/${groupId}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      toast.success("링크가 클립보드에 복사되었습니다");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      toast.error("링크 복사에 실패했습니다");
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white">
      <Header title="QR 공유하기" onBack={handleBack} />

      <div className="flex flex-1 flex-col items-center gap-10 px-4 pt-14 sm:gap-[72px] sm:px-5 sm:pt-[130px]">
        <h2 className="text-center text-xl font-bold leading-7 text-foreground sm:text-2xl sm:leading-8">
          그룹 이름 : {groupName}
        </h2>

        <div className="flex w-full items-center justify-center">
          {imageError ? (
            <div className="flex aspect-square w-full max-w-[300px] items-center justify-center rounded-lg border border-border bg-muted">
              <p className="text-sm text-muted-foreground">QR 코드를 불러올 수 없습니다</p>
            </div>
          ) : (
            <img
              src={qrImageUrl}
              alt={`${groupName} 그룹 QR 코드`}
              width={200}
              height={200}
              className="size-[180px] object-contain sm:size-[200px]"
              onError={() => setImageError(true)}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            ref={kakaoButtonRef}
            disabled={!isKakaoReady}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-[#FEE500] px-6 py-3 text-sm font-bold leading-[18px] text-black/85 transition-colors active:bg-[#FEE500]/80 disabled:opacity-50 sm:h-16"
          >
            <MessageCircle className="size-5" />
            {isKakaoReady ? "카카오톡으로 공유하기" : "로딩 중..."}
          </button>

          <button
            onClick={handleCopyLink}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-primary/15 px-6 py-3 text-sm font-bold leading-[18px] text-primary transition-colors active:bg-primary/25 sm:h-16"
          >
            <Share2 className="size-5" />
            링크 복사하기
          </button>
        </div>
      </div>
    </div>
  );
}
