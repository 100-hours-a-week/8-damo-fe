"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GroupImageUploadField } from "./group-image-upload-field";
import { GroupNameInputField } from "./group-name-input-field";
import { GroupIntroductionInputField } from "./group-introduction-input-field";
import { GroupLocationInputField } from "./group-location-input-field";
import { GroupCreateSubmitArea } from "./group-create-submit-area";
import { createGroup } from "@/src/lib/api/client/groups";
import { getPresignedUrl } from "@/src/lib/api/client/s3";
import { getImageContentType } from "@/src/constants/s3/util";
import { containsEmoji } from "@/src/utils/text";

export type GroupCreateFormValues = {
  imagePath: string;
  groupImage: string;
  groupName: string;
  introduction: string;
};

interface GroupCreateContainerProps {
  defaultValues?: Partial<GroupCreateFormValues>;
  onSubmit?: (data: GroupCreateFormValues) => void;
}

export function GroupCreateContainer({
  defaultValues,
  onSubmit,
}: GroupCreateContainerProps) {
  const router = useRouter();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<GroupCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      imagePath: "",
      groupImage: "",
      groupName: "",
      introduction: "",
      ...defaultValues,
    },
  });

  const onFormSubmit = async (data: GroupCreateFormValues) => {
    if (containsEmoji(data.groupName) || containsEmoji(data.introduction)) {
      toast.error("이모지는 작성할 수 없습니다.");
      return;
    }

    if (!location) {
      toast.error("그룹 위치를 제공해주세요.");
      return;
    }

    let imagePath = "";

    if (profileImageFile) {
      if (profileImageFile.size > 10 * 1024 * 1024) {
        toast.error("최대 용량은 10MB입니다.");
        return;
      }

      const profileImageContentType = getImageContentType(profileImageFile);

      if (!profileImageContentType) {
        toast.error("지원하지 않는 이미지 형식입니다.");
        return;
      }

      try {
        const presignedResult = await getPresignedUrl({
          directory: "groups/profile",
          fileName: profileImageFile.name,
          contentType: profileImageContentType,
        });

        if (!presignedResult.data) {
          toast.error("업로드 실패, 재시도 해주세요.");
          return;
        }

        const uploadResponse = await fetch(presignedResult.data.presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": profileImageContentType,
          },
          body: profileImageFile,
        });

        if (!uploadResponse.ok) {
          toast.error("업로드 실패, 재시도 해주세요.");
          return;
        }

        imagePath = presignedResult.data.objectKey;
      } catch {
        toast.error("업로드 실패, 재시도 해주세요.");
        return;
      }
    }

    try {
      await createGroup({
        name: data.groupName,
        introduction: data.introduction ?? "",
        latitude: location.latitude,
        longitude: location.longitude,
        imagePath,
      });

      if (onSubmit) {
        await onSubmit(data);
      }

      toast.success("그룹이 생성되었습니다.");
      router.push("/groups");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "그룹 생성에 실패했습니다.")
          : "그룹 생성에 실패했습니다.";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex min-h-[calc(100dvh-64px)] flex-col bg-background px-4 py-6 sm:min-h-[calc(100dvh-80px)] sm:px-5 sm:py-8"
    >
      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto flex w-full max-w-[380px] flex-col gap-4">
          <GroupImageUploadField
            name="groupImage"
            control={control}
            onFileChange={setProfileImageFile}
          />

          <div className="flex flex-col gap-5 sm:gap-6">
            <GroupNameInputField name="groupName" control={control} />
            <GroupIntroductionInputField name="introduction" control={control} />
            <GroupLocationInputField onLocationChange={setLocation} />
          </div>

          <GroupCreateSubmitArea
            isSubmitting={isSubmitting}
            isValid={isValid && !!location}
          />
        </div>
      </div>
    </form>
  );
}
