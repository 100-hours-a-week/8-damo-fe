import { Header } from "@/src/components/layout/header";
import { GroupCreateContainer } from "@/src/components/groups/create/group-create-container";

export default function GroupCreatePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background">
      <Header title="그룹 만들기" showBackButton={true} backPath="/groups" />
      <GroupCreateContainer />
    </div>
  );
}
