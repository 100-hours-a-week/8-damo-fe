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

export async function appendToSheet(rows: SheetRow[]): Promise<void> {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const values = rows.map(({ measured_at, label, mode, url, metrics }) => [
    measured_at,
    label,
    mode,
    url,
    metrics.fcp.toFixed(0),
    metrics.lcp.toFixed(0),
    metrics.cls.toFixed(3),
    metrics.tbt.toFixed(0),
    metrics.score.toFixed(1),
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:I',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
