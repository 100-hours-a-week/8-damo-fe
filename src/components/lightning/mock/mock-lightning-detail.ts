import type { LightningDetail } from "@/src/types/lightning";

export const MOCK_LIGHTNING_DETAILS: LightningDetail[] = [
  {
    id: "1",
    title: "홍대 맛집 투어 🍜",
    meetingDate: "2026년 2월 8일 · 오후 7:00",
    restaurantName: "홍대입구역 3번 출구",
    currentParticipants: 4,
    maxParticipants: 6,
    description:
      "홍대 맛집 투어 같이 하실 분! 분위기 좋은 곳 위주로 같이 먹고 가볍게 산책해요.",
    location: {
      lat: 37.5563,
      lng: 126.9236,
    },
    participants: [
      { id: "1", nickname: "민지", avatarUrl:"https://images.pexels.com/photos/5426072/pexels-photo-5426072.jpeg" },
      { id: "2", nickname: "현우" },
      { id: "3", nickname: "수아" },
      { id: "4", nickname: "도윤" },
    ],
  },
  {
    id: "2",
    title: "강남 보드게임 모임",
    meetingDate: "2026년 2월 8일 · 오후 8:30",
    restaurantName: "강남역 보드게임카페",
    currentParticipants: 3,
    maxParticipants: 5,
    description:
      "보드게임 초보도 환영해요. 가볍게 아이스브레이킹하고 2~3개 게임 같이 즐겨요.",
    location: {
      lat: 37.4982,
      lng: 127.0276,
    },
    participants: [
      { id: "1", nickname: "지훈", },
      { id: "2", nickname: "서연" },
      { id: "3", nickname: "준호" },
    ],
  },
  {
    id: "3",
    title: "한강 야경 산책",
    meetingDate: "2026년 2월 8일 · 오후 9:00",
    restaurantName: "여의도 한강공원",
    currentParticipants: 2,
    maxParticipants: 4,
    description:
      "야경 보면서 가볍게 산책해요. 커피 한 잔 들고 이야기 나누실 분 구해요.",
    location: {
      lat: 37.5289,
      lng: 126.9326,
    },
    participants: [
      { id: "1", nickname: "연우" },
      { id: "2", nickname: "하린" },
    ],
  },
  {
    id: "4",
    title: "퇴근 후 스터디 카페",
    meetingDate: "2026년 2월 9일 · 오후 6:40",
    restaurantName: "합정역 스터디카페",
    currentParticipants: 5,
    maxParticipants: 6,
    description:
      "퇴근 후 2시간 집중 스터디 하실 분 모집합니다. 각자 할 일 가져와서 같이 집중해요.",
    location: {
      lat: 37.5496,
      lng: 126.9137,
    },
    participants: [
      { id: "1", nickname: "지민" },
      { id: "2", nickname: "예린" },
      { id: "3", nickname: "태윤" },
      { id: "4", nickname: "다은" },
      { id: "5", nickname: "승민" },
    ],
  },
];

export function getMockLightningDetailById(lightningId: string) {
  return MOCK_LIGHTNING_DETAILS.find((item) => item.id === lightningId) ?? null;
}
