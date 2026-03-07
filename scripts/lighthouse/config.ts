export const BASE_URL = "https://dev.damo.today";
export const TEST_USER_ID = "1";
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

export const PERF_TEST_GROUP_ID = process.env.PERF_TEST_GROUP_ID;
export const PERF_TEST_DINING_ID_AV = process.env.PERF_TEST_DINING_ID_AV;
export const PERF_TEST_DINING_ID_RV = process.env.PERF_TEST_DINING_ID_RV;
export const PERF_TEST_DINING_ID_CF = process.env.PERF_TEST_DINING_ID_CF;
export const PERF_TEST_LIGHTNING_ID_CHAT = process.env.PERF_TEST_LIGHTNING_ID_CHAT;
export const PERF_TEST_LIGHTNING_ID_DETAIL = process.env.PERF_TEST_LIGHTNING_ID_DETAIL;

export const PAGES = [
  { name: 'main', path: '/' },
  { name: 'groups', path: '/groups' },
  { name: 'groups-detail', path: `/groups/${PERF_TEST_GROUP_ID}`},
  { name: 'dining-av', path: `/groups/${PERF_TEST_GROUP_ID}/dining/${PERF_TEST_DINING_ID_AV}`},
  { name: 'dining-rv', path: `/groups/${PERF_TEST_GROUP_ID}/dining/${PERF_TEST_DINING_ID_RV}`},
  { name: 'dining-cf', path: `/groups/${PERF_TEST_GROUP_ID}/dining/${PERF_TEST_DINING_ID_CF}`},
  { name: 'lightning_joined', path: '/lightning?tab=joined' },
  { name: 'lightning_available', path: '/lightning?tab=available' },
  { name: 'lightning-detail', path: `/lightning/details/${PERF_TEST_LIGHTNING_ID_DETAIL}`},
  { name: 'lightning-chat', path: `/lightning/${PERF_TEST_LIGHTNING_ID_CHAT}`}
] as const;

export type LighthouseMode = 'mobile-slow4g' | 'desktop';

export const MODES: LighthouseMode[] = ['mobile-slow4g', 'desktop'];
