import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileJson2, RefreshCw, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  clearLocalSiteConfig,
  downloadSiteConfig,
  fetchBundledSiteConfig,
  formatSiteConfig,
  importSiteConfigFile,
  parseSiteConfigText,
  readLocalSiteConfig,
  saveLocalSiteConfig,
} from '@/lib/site-config';
import type { OverviewResponse } from '@/types/portfolio';

export function AdminCmsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [baseConfig, setBaseConfig] = useState<OverviewResponse | null>(null);
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const bundled = await fetchBundledSiteConfig();
        const local = readLocalSiteConfig();
        setBaseConfig(bundled);
        setEditorValue(formatSiteConfig(local || bundled));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : '配置加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = window.setTimeout(() => setNotice(''), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const currentConfig = useMemo(() => {
    try {
      return parseSiteConfigText(editorValue);
    } catch {
      return null;
    }
  }, [editorValue]);

  const summary = useMemo(() => {
    if (!currentConfig) {
      return [];
    }
    const cardCount = currentConfig.sections.reduce((total, section) => total + section.items.length, 0);
    return [
      { label: '顶部图标', value: currentConfig.icons.length },
      { label: '内容卡片', value: cardCount },
      { label: '时间线', value: currentConfig.timeline.length },
      { label: '标签', value: currentConfig.tags.length },
    ];
  }, [currentConfig]);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const parsed = parseSiteConfigText(editorValue);
      saveLocalSiteConfig(parsed);
      setNotice('本地配置已保存，前台会立即读取新配置');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!baseConfig) {
      return;
    }
    clearLocalSiteConfig();
    setEditorValue(formatSiteConfig(baseConfig));
    setNotice('已恢复为默认 site-config.json');
  }

  async function handleReload() {
    try {
      const bundled = await fetchBundledSiteConfig();
      const local = readLocalSiteConfig();
      setBaseConfig(bundled);
      setEditorValue(formatSiteConfig(local || bundled));
      setNotice('配置已重新加载');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '重新加载失败');
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imported = await importSiteConfigFile(file);
      setEditorValue(formatSiteConfig(imported));
      setNotice('配置文件已导入，记得点击保存');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '导入失败');
    } finally {
      event.target.value = '';
    }
  }

  function handleExport() {
    try {
      const parsed = parseSiteConfigText(editorValue);
      downloadSiteConfig(parsed);
      setNotice('site-config.json 已导出');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '导出失败');
    }
  }

  function handleFormat() {
    try {
      const parsed = parseSiteConfigText(editorValue);
      setEditorValue(formatSiteConfig(parsed));
      setNotice('JSON 已格式化');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '格式化失败');
    }
  }

  if (loading) {
    return <div className="admin-page"><div className="admin-loading">正在加载配置编辑器...</div></div>;
  }

  return (
    <div className="admin-page admin-console-page">
      <div className="admin-console-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-logo">站</span>
            <div>
              <strong>个人网站配置台</strong>
              <small>前端静态配置模式</small>
            </div>
          </div>
          <nav className="admin-sidebar-nav">
            <button type="button" className="admin-sidebar-link active">
              <span className="admin-sidebar-copy">
                <strong>site-config.json</strong>
                <small>所有前台内容都在这个文件里</small>
              </span>
            </button>
          </nav>
          <div className="admin-sidebar-footer">
            <span className="admin-status-pill">STATIC</span>
            <p>保存到浏览器本地后，首页会立即读取。导出后可直接替换项目里的 public/site-config.json。</p>
          </div>
        </aside>

        <section className="admin-workspace">
          <header className="admin-console-topbar">
            <div>
              <p className="eyebrow">配置驱动</p>
              <h1>站点配置编辑器</h1>
              <p className="admin-subtitle">这版不再依赖数据库和后端接口。前端首页直接读取 [site-config.json](/E:/myagentos/context-infrastructure/adhoc_jobs/tmp_githubuiuxnotion/web/public/site-config.json)，你可以在这里改、保存、导入、导出。</p>
            </div>
            <div className="admin-actions">
              <Link className="ghost-action admin-ghost-action" to="/">查看前台</Link>
              <button className="ghost-action admin-ghost-action" type="button" onClick={handleReload}>
                <RefreshCw size={16} />
                重新加载
              </button>
              <button className="ghost-action admin-ghost-action" type="button" onClick={handleReset}>
                恢复默认
              </button>
            </div>
          </header>

          {error ? <div className="admin-banner error">{error}</div> : null}
          {notice ? <div className="admin-banner success">{notice}</div> : null}

          <main className="admin-content">
            <section className="admin-panel">
              <div className="admin-metric-grid">
                {summary.map((item) => (
                  <article key={item.label} className="admin-metric-card">
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                    <span>当前编辑区里的配置统计</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <p className="admin-panel-eyebrow">使用方式</p>
                  <h2>轻量配置流</h2>
                </div>
              </div>
              <div className="admin-panel-stack">
                <div className="admin-subpanel">
                  <div className="admin-helper-list">
                    <p>1. 直接编辑下面的 JSON。</p>
                    <p>2. 点击保存到本地，当前浏览器里的前台会立即更新。</p>
                    <p>3. 确认满意后点击导出，把下载下来的 site-config.json 覆盖到项目的 public/site-config.json。</p>
                    <p>4. 如果以后部署到静态托管，只需要带着这个 JSON 一起发布，不需要数据库和后端。</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <p className="admin-panel-eyebrow">配置文件</p>
                  <h2>JSON 编辑区</h2>
                </div>
                <div className="admin-panel-actions">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  />
                  <button className="ghost-action admin-ghost-action" type="button" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={16} />
                    导入 JSON
                  </button>
                  <button className="ghost-action admin-ghost-action" type="button" onClick={handleFormat}>
                    <FileJson2 size={16} />
                    格式化
                  </button>
                  <button className="ghost-action admin-ghost-action" type="button" onClick={handleExport}>
                    <Download size={16} />
                    导出 JSON
                  </button>
                  <button className="primary-action" type="button" disabled={saving} onClick={() => void handleSave()}>
                    <Save size={16} />
                    保存到本地
                  </button>
                </div>
              </div>
              <label className="form-field">
                <span>site-config.json</span>
                <textarea
                  className="json-editor"
                  rows={30}
                  value={editorValue}
                  onChange={(event) => setEditorValue(event.target.value)}
                  spellCheck={false}
                />
              </label>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
}
