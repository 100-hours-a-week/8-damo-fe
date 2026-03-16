import { Header } from "@/src/components/layout/header";
import { DiningCreateContainer } from "@/src/components/dining/create/dining-create-container";

interface DiningCreatePageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function DiningCreatePage({
  params,
}: DiningCreatePageProps) {
  const { groupId } = await params;

  return (
    <div className="flex h-screen flex-col mx-auto min-h-screen w-full max-w-[430px] bg-background">
      <Header title="회식 만들기" showBackButton={true} backPath={`/groups/${groupId}`} />
      <DiningCreateContainer groupId={groupId} />
    </div>
  );
}
