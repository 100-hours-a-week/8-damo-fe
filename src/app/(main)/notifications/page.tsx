import { NotificationsPageContent } from "@/src/components/notifications/notifications-page-content";
import { Notification } from "@/src/components/notifications/notification-card";

const mockNotifications: Notification[] = [
  {
    title: "새로운 번개 모임이 생성되었어요!",
    body: "홍대 파스타 모임이 회원님 근처에서 시작됩니다. 지금 참여하세요!",
    time: "5분 전",
    isRead: false,
  },
  {
    title: "성수 브런치 모임",
    body: "김민수님: 10분 정도 늦을 것 같아요! 먼저 주문하셔도 돼요~",
    time: "1시간 전",
    isRead: false,
  },
  {
    title: "모임이 곧 시작됩니다",
    body: "한강 치맥 모임이 30분 후 시작됩니다. 준비하세요!",
    time: "2시간 전",
    isRead: true,
  },
  {
    title: "리뷰를 작성해주세요",
    body: "을지로 투어 모임은 어떠셨나요? 솔직한 후기를 남겨주세요.",
    time: "5시간 전",
    isRead: true,
  },
  {
    title: "모집이 마감되었습니다",
    body: "합정 북카페 독서 모임의 모집이 마감되었습니다.",
    time: "1일 전",
    isRead: true,
  },
  {
    title: "여의도 한강공원 모임",
    body: "박지민님: 사진 공유 감사합니다! 정말 즐거운 시간이었어요 ^^",
    time: "2일 전",
    isRead: true,
  },
];

export default function NotificationsPage() {
  return <NotificationsPageContent notifications={mockNotifications} />;
}
