import { Header } from "@/src/components/layout/header";
import { getMyProfile } from "@/src/lib/api/server/user";
import { EditCharacteristicContainer } from "@/src/components/mypage/edit-profile/edit-characteristic-container";

export default async function EditCharacteristicPage() {
  let initialData = {
    allergies: [] as string[],
    likeFoods: [] as string[],
    likeIngredients: [] as string[],
    otherCharacteristics: "",
  };

  try {
    initialData = await getMyProfile();
  } catch {
    // 에러 시 기본값 사용
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title="개인 특성 수정" backPath="/mypage" />
      <EditCharacteristicContainer initialData={initialData} />
    </div>
  );
}
