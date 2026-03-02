'use client';
import { MyGroupHeader } from "./my-group-header";
import { MyGroupList } from "./my-group-list";
import { MyGroupActionsFAB } from "./my-group-actions-fab";
import { BottomNavigationBar } from "../../layout";
import { GroupSummary } from "@/src/types/groups";

interface GroupsPageContentProps {
  groups: GroupSummary[];
}

export function GroupsPageContent({ groups }: GroupsPageContentProps) {
  return (
    <div className="relative flex h-full flex-col">
      <MyGroupHeader />
      <div className="relative flex-1 overflow-y-auto bg-[#f2f2f7]">
        <main className="flex flex-col gap-6 pt-6">
          <MyGroupList groupSummaryList={groups} />
        </main>
      </div>
      <MyGroupActionsFAB/>
      <BottomNavigationBar />
    </div>
  );
}