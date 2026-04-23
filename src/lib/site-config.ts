import type { OverviewResponse } from '@/types/portfolio';

const STORAGE_KEY = 'site-config-override-v1';
export const SITE_CONFIG_UPDATED_EVENT = 'site-config-updated';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function assertSiteConfig(value: unknown): asserts value is OverviewResponse {
  if (!isRecord(value)) {
    throw new Error('配置必须是一个 JSON 对象');
  }

  const requiredKeys = ['site', 'hero', 'icons', 'sections', 'timeline', 'tags', 'articles', 'theme_assets'];
  for (const key of requiredKeys) {
    if (!(key in value)) {
      throw new Error(`配置缺少必填字段: ${key}`);
    }
  }
}

export async function fetchBundledSiteConfig(): Promise<OverviewResponse> {
  const response = await fetch('/site-config.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('默认配置读取失败');
  }
  const data = (await response.json()) as unknown;
  assertSiteConfig(data);
  return data;
}

export function readLocalSiteConfig(): OverviewResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  const data = JSON.parse(raw) as unknown;
  assertSiteConfig(data);
  return data;
}

export async function loadSiteConfig(): Promise<OverviewResponse> {
  const bundled = await fetchBundledSiteConfig();
  try {
    return readLocalSiteConfig() || bundled;
  } catch {
    return bundled;
  }
}

function notifySiteConfigUpdated() {
  window.dispatchEvent(new CustomEvent(SITE_CONFIG_UPDATED_EVENT));
}

export function saveLocalSiteConfig(config: OverviewResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  notifySiteConfigUpdated();
}

export function clearLocalSiteConfig() {
  localStorage.removeItem(STORAGE_KEY);
  notifySiteConfigUpdated();
}

export function formatSiteConfig(config: OverviewResponse) {
  return JSON.stringify(config, null, 2);
}

export function parseSiteConfigText(text: string): OverviewResponse {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('JSON 格式不合法');
  }
  assertSiteConfig(parsed);
  return parsed;
}

export async function importSiteConfigFile(file: File): Promise<OverviewResponse> {
  const text = await file.text();
  return parseSiteConfigText(text);
}

export function downloadSiteConfig(config: OverviewResponse) {
  const blob = new Blob([formatSiteConfig(config)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'site-config.json';
  link.click();
  URL.revokeObjectURL(url);
}
