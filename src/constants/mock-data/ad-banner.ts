import type { AdBanner } from "@/src/types/home";

// 기본 배너 (정상 케이스)
export const mockAdBanner: AdBanner = {
    id: "banner-1",
    imageUrl: "/images/banners/promotion-banner.png",
    title: "Damo 오픈 기념 이벤트",
    linkUrl: "/events/launch",
};

// 외부 링크 배너
export const mockExternalLinkBanner: AdBanner = {
    id: "banner-2",
    imageUrl: "/images/banners/external-banner.png",
    title: "파트너 식당 할인 이벤트",
    linkUrl: "https://example.com/promotion",
};

// 링크 없는 배너 (이미지만 표시)
export const mockNoLinkBanner: AdBanner = {
    id: "banner-3",
    imageUrl: "/images/banners/info-banner.png",
    title: "서비스 업데이트 안내",
};
