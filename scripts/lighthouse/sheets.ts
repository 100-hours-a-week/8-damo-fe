import { google } from 'googleapis';
import { SPREADSHEET_ID } from './config.js';
import type { LighthouseMetrics } from './measure.js';

export interface SheetRow {
  measured_at: string;
  label: string;
  mode: string;
  url: string;
  metrics: LighthouseMetrics;
}

type MetricStatus = '🟢' | '🟡' | '🔴';

function getStatusByThresholds(
  value: number,
  thresholds: { goodMax?: number; needsImprovementMax?: number; goodMin?: number; needsImprovementMin?: number },
): MetricStatus {
  if (typeof thresholds.goodMax === 'number' && typeof thresholds.needsImprovementMax === 'number') {
    if (value <= thresholds.goodMax) return '🟢';
    if (value <= thresholds.needsImprovementMax) return '🟡';
    return '🔴';
  }

  if (typeof thresholds.goodMin === 'number' && typeof thresholds.needsImprovementMin === 'number') {
    if (value >= thresholds.goodMin) return '🟢';
    if (value >= thresholds.needsImprovementMin) return '🟡';
    return '🔴';
  }

  return '🔴';
}

export async function appendToSheet(rows: SheetRow[]): Promise<void> {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const values = rows.map(({ measured_at, label, mode, url, metrics }) => [
    measured_at,
    mode,
    label,
    url,
    metrics.fcp.toFixed(0),
    getStatusByThresholds(metrics.fcp, { goodMax: 1800, needsImprovementMax: 3000 }),
    metrics.lcp.toFixed(0),
    getStatusByThresholds(metrics.lcp, { goodMax: 2500, needsImprovementMax: 4000 }),
    metrics.cls.toFixed(3),
    getStatusByThresholds(metrics.cls, { goodMax: 0.1, needsImprovementMax: 0.25 }),
    metrics.tbt.toFixed(0),
    getStatusByThresholds(metrics.tbt, { goodMax: 200, needsImprovementMax: 600 }),
    metrics.score.toFixed(1),
    getStatusByThresholds(metrics.score, { goodMin: 90, needsImprovementMin: 50 }),
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:N',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
