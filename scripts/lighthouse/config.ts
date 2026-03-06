export const BASE_URL = "https://dev.damo.today";
export const TEST_USER_ID = "1";
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

export const PAGES = [
  { name: 'main', path: '/' },
  { name: 'groups', path: '/groups' },
  { name: 'lightning_joined', path: '/lightning?tab=joined' },
  { name: 'lightning_available', path: '/lightning?tab=available' },
] as const;

export type LighthouseMode = 'mobile-slow4g' | 'desktop';

export const MODES: LighthouseMode[] = ['mobile-slow4g', 'desktop'];
