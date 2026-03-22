"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ProfileImageField,
  NicknameField,
  GenderField,
  AgeGroupField,
  type BasicInfoFormValues,
} from "@/src/components/onboarding/basic";
import { basicInfoSchema } from "@/src/lib/schema/basic-information";
import { updateBasicInfo } from "@/src/lib/api/client/user";
import { getPresignedUrl } from "@/src/lib/api/client/s3";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/ui/sonner";
import { getImageContentType } from "@/src/constants/s3/util";
import { useUserStore } from "@/src/stores/user-store";
import { containsEmoji } from "@/src/utils/text";

interface EditBasicContainerProps {
  initialData: {
    nickname: string;
    gender: "MALE" | "FEMALE" | undefined;
    ageGroup: "TWENTIES" | "THIRTIES" | "FORTIES" | "FIFTIES_PLUS" | undefined;
    imagePath: string;
  };
}

export function EditBasicContainer({ initialData }: EditBasicContainerProps) {
  const router = useRouter();
  const updateUserStore = useUserStore((state) => state.updateBasicInfo);
  const updateOnboardingStep = useUserStore((state) => state.updateOnboardingStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_CDN;
  const profileUrl = `https://${s3BaseUrl}/${initialData.imagePath}`;

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    mode: "all",
    defaultValues: {
      profileImage: null,
      nickname: initialData.nickname,
      gender: initialData.gender,
      ageGroup: initialData.ageGroup,
    },
  });

  const onSubmit = async (data: BasicInfoFormValues) => {
    if (containsEmoji(data.nickname)) {
      toast.error("이모지는 작성할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    let newImagePath = initialData.imagePath;
    const profileImage = data.profileImage;

    if (profileImage) {
      if (profileImage.size > 10 * 1024 * 1024) {
        toast.error("최대 용량은 10MB입니다.");
        setIsSubmitting(false);
        return;
      }

      const profileImageContentType = getImageContentType(profileImage);

      if (!profileImageContentType) {
        toast.error("지원하지 않는 이미지 형식입니다.");
        setIsSubmitting(false);
        return;
      }

      try {
        const presignedResult = await getPresignedUrl({
          directory: "users/profile",
          fileName: profileImage.name,
          contentType: profileImageContentType,
        });

        if (!presignedResult.data) {
          toast.error("이미지 업로드 실패, 재시도 해주세요.");
          setIsSubmitting(false);
          return;
        }

        const uploadResponse = await fetch(presignedResult.data.presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": profileImageContentType,
          },
          body: profileImage,
        });

        if (!uploadResponse.ok) {
          toast.error("업로드 실패, 재시도 해주세요.");
          setIsSubmitting(false);
          return;
        }

        newImagePath = presignedResult.data.objectKey;
      } catch {
        toast.error("업로드 실패, 재시도 해주세요.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await updateBasicInfo({
        imagePath: newImagePath,
        nickname: data.nickname,
        gender: data.gender,
        ageGroup: data.ageGroup,
      });

      updateUserStore({
        nickname: data.nickname,
        gender: data.gender,
        ageGroup: data.ageGroup,
        imagePath: newImagePath,
      });
      updateOnboardingStep("DONE");
      toast.success("저장되었습니다");
      router.push("/mypage");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "저장에 실패했습니다.")
          : "저장에 실패했습니다.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="flex-1 px-4 pb-24 pt-4">
        <div className="mt-8">
          <ProfileImageField
            name="profileImage"
            control={control}
            fallbackUrl={profileUrl}
            previewImgUrl={profileUrl}
          />
        </div>

        <div className="mt-12 flex flex-col gap-11">
          <NicknameField name="nickname" control={control} />
          <GenderField name="gender" control={control} />
          <AgeGroupField name="ageGroup" control={control} />
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 w-full bg-background p-4">
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting || !isDirty}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
