import { buildApifyRedditScraperInput, getApifyRunSyncUrl } from './config';
import type { ApifyDatasetItem, ProcessGetRedditThreadDataInput, ProcessGetRedditThreadDataResult } from './types';

const LOG = '[get-reddit-thread-data]';

/**
 * Proxies a Reddit thread url to Apify trudax~reddit-scraper-lite run-sync-get-dataset-items.
 */
export const processGetRedditThreadData = async (
  input: ProcessGetRedditThreadDataInput
): Promise<ProcessGetRedditThreadDataResult> => {
  const token = process.env.APIFY_API_TOKEN?.trim();
  if (!token) {
    console.warn(`❌ ${LOG} APIFY_API_TOKEN is not set`);
    return { rawError: 'APIFY_API_TOKEN is not configured on the server' };
  }

  const url = typeof input.url === 'string' ? input.url.trim() : '';
  if (!url) {
    return { rawError: 'Empty url' };
  }

  const apifyUrl = getApifyRunSyncUrl(token);
  const body = buildApifyRedditScraperInput(url);

  console.log(`🚀 ${LOG} POST Apify run-sync-get-dataset-items url=${JSON.stringify(url)}`);

  const startedAt = Date.now();
  let response: Response;

  try {
    response = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${LOG} fetch failed`, message);
    return { rawError: message };
  }

  const text = await response.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    console.error(`❌ ${LOG} non-JSON response status=${response.status}`, text.slice(0, 200));
    return { rawError: `Apify returned non-JSON (HTTP ${response.status})` };
  }

  if (!response.ok) {
    const errObj = parsed as { error?: { message?: string } };
    const msg = errObj.error?.message || `Apify HTTP ${response.status}`;
    console.warn(`❌ ${LOG} Apify error ${msg}`);
    return { rawError: msg };
  }

  if (!Array.isArray(parsed)) {
    const errObj = parsed as { error?: { message?: string } };
    if (errObj.error?.message) {
      console.warn(`❌ ${LOG} Apify error ${errObj.error.message}`);
      return { rawError: errObj.error.message };
    }
    console.error(`❌ ${LOG} unexpected response shape`);
    return { rawError: 'Apify returned an unexpected response shape' };
  }

  const items = parsed as ApifyDatasetItem[];
  console.log(
    `✅ ${LOG} ok count=${items.length} durationMs=${Date.now() - startedAt}`
  );

  return { items };
};
