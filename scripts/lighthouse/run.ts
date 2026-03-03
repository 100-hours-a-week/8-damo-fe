import { BASE_URL, TEST_USER_ID, SPREADSHEET_ID, PAGES, MODES } from './config.js';
import { authenticate } from './authenticate.js';
import { measurePage } from './measure.js';
import { appendToSheet, type SheetRow } from './sheets.js';

function validateEnv() {
  const missing = (
    [
      ['LIGHTHOUSE_BASE_URL', BASE_URL],
      ['LIGHTHOUSE_TEST_USER_ID', TEST_USER_ID],
      ['GOOGLE_SHEETS_SPREADSHEET_ID', SPREADSHEET_ID],
      ['GOOGLE_APPLICATION_CREDENTIALS', process.env.GOOGLE_APPLICATION_CREDENTIALS],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`필수 환경변수 누락: ${missing.join(', ')}`);
  }
}

async function main() {
  console.log('=== Lighthouse 성능 측정 시작 ===\n');

  validateEnv();

  console.log('1. Playwright 인증 중...');
  const cookieHeader = await authenticate();
  console.log('   ✓ 인증 완료\n');

  console.log('2. 페이지별 측정 중... (모드별 5회 평균)\n');
  const measuredAt = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' });
  const rows: SheetRow[] = [];

  for (const { name, path } of PAGES) {
    const url = `${BASE_URL}${path}`;

    for (const mode of MODES) {
      console.log(`   [${name}] [${mode}] ${url}`);

      const metrics = await measurePage(url, cookieHeader, mode);
      rows.push({ measured_at: measuredAt, label: name, mode, url, metrics });

      console.log(
        `   → 평균 — FCP: ${metrics.fcp.toFixed(0)}ms, LCP: ${metrics.lcp.toFixed(0)}ms, CLS: ${metrics.cls.toFixed(3)}, TBT: ${metrics.tbt.toFixed(0)}ms, Score: ${metrics.score.toFixed(1)}\n`,
      );
    }
  }

  console.log('3. Google Sheets 저장 중...');
  await appendToSheet(rows);
  console.log('   ✓ 저장 완료\n');

  console.log('=== 측정 완료 ===\n');
  console.log('요약:');
  console.log(
    ['label', 'mode', 'FCP(ms)', 'LCP(ms)', 'CLS', 'TBT(ms)', 'Score']
      .map((h) => h.padEnd(18))
      .join(''),
  );
  console.log('-'.repeat(126));
  for (const { label, mode, metrics } of rows) {
    console.log(
      [
        label,
        mode,
        metrics.fcp.toFixed(0),
        metrics.lcp.toFixed(0),
        metrics.cls.toFixed(3),
        metrics.tbt.toFixed(0),
        metrics.score.toFixed(1),
      ]
        .map((v) => v.padEnd(18))
        .join(''),
    );
  }
}

main().catch((err) => {
  console.error('오류:', err.message);
  process.exit(1);
});
