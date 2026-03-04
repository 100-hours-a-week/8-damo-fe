import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import type { Config } from 'lighthouse';
import { LighthouseMode } from './config';

const AUDITS = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
];

const RUNS = 5;

export interface LighthouseMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  score: number;
}

function getSettings(mode: LighthouseMode): Config['settings'] {
  switch (mode) {
    case 'mobile-slow4g':
      return {
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 150,
          throughputKbps: 1600,
          cpuSlowdownMultiplier: 4,
        },
        formFactor: 'mobile',
        screenEmulation: { mobile: true },
      } as const satisfies NonNullable<Config['settings']>;

    case 'no-throttle':
      return {
        throttlingMethod: 'provided',
      } as const satisfies NonNullable<Config['settings']>;

    default:
      return {} as const satisfies NonNullable<Config['settings']>;
  }
}

async function runOnce(url: string, cookieHeader: string, mode: LighthouseMode): Promise<LighthouseMetrics> {
  const chrome = await launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'json',
        onlyAudits: AUDITS,
        extraHeaders: { Cookie: cookieHeader },
        logLevel: 'error',
        ...getSettings(mode),
      },
      undefined
    );

    const lhr = result?.lhr;
    if (!lhr) throw new Error(`Lighthouse returned no result for ${url}`);

    const numericValue = (key: string) => lhr.audits[key]?.numericValue ?? 0;

    return {
      fcp: numericValue('first-contentful-paint'),
      lcp: numericValue('largest-contentful-paint'),
      cls: numericValue('cumulative-layout-shift'),
      tbt: numericValue('total-blocking-time'),
      score: (lhr.categories['performance']?.score ?? 0) * 100,
    };
  } finally {
    await chrome.kill();
  }
}

function avg(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export async function measurePage(
  url: string,
  cookieHeader: string,
  mode: LighthouseMode,
): Promise<LighthouseMetrics> {
  const runs: LighthouseMetrics[] = [];

  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`     run ${i + 1}/${RUNS} ... `);
    const m = await runOnce(url, cookieHeader, mode);
    runs.push(m);
    console.log(`FCP ${m.fcp.toFixed(0)}ms, LCP ${m.lcp.toFixed(0)}ms, TBT ${m.tbt.toFixed(0)}ms, Score ${m.score.toFixed(0)}`);
  }

  return {
    fcp: avg(runs.map((r) => r.fcp)),
    lcp: avg(runs.map((r) => r.lcp)),
    cls: avg(runs.map((r) => r.cls)),
    tbt: avg(runs.map((r) => r.tbt)),
    score: avg(runs.map((r) => r.score)),
  };
}
