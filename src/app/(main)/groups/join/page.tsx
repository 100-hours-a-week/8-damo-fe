import { Header } from "@/src/components/layout";
import { GroupJoinContainer } from "@/src/components/groups/join/group-join-container";

export default function GroupJoinPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header title="그룹 참여" backPath="/groups" />
      <main className="flex flex-1 flex-col">
        <GroupJoinContainer />
      </main>
    </div>
  );
}
