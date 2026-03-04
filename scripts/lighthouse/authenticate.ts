import { chromium } from 'playwright';
import { BASE_URL } from './config.js';

export async function authenticate(): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/login-test`);
    await page.getByRole('button', { name: '인증 테스트' }).click();
    await page.waitForURL(`${BASE_URL}/`);

    const cookies = await context.cookies();
    const relevant = cookies.filter((c) =>
      ['access_token', 'refresh_token'].includes(c.name),
    );

    if (relevant.length === 0) {
      throw new Error('인증 쿠키를 찾을 수 없습니다.');
    }

    return relevant.map((c) => `${c.name}=${c.value}`).join('; ');
  } finally {
    await browser.close();
  }
}
