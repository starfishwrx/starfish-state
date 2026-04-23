import { startTransition, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import {
  Blocks,
  BriefcaseBusiness,
  Code2,
  Copy,
  FileText,
  Github,
  LockKeyhole,
  Mail,
  Menu,
  MoonStar,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';

import { SITE_CONFIG_UPDATED_EVENT, loadSiteConfig } from '@/lib/site-config';
import type { Article, ContentItem, ContentSection, NavIcon, OverviewResponse, ThemeAssets } from '@/types/portfolio';

type ThemeMode = 'Light' | 'Dark';

interface CardItem {
  title: string;
  description: string;
  href?: string;
  image?: string;
  badge?: string;
  meta?: string;
  openInNewTab?: boolean;
}

function shortenText(value: string | null | undefined, limit = 110) {
  const text = (value || '').trim();
  if (!text) {
    return '';
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1).trimEnd()}...`;
}

function formatArticleMeta(article: Article) {
  const parts = [`${article.reading_minutes} min`];
  if (article.published_at) {
    const date = new Date(article.published_at);
    if (!Number.isNaN(date.getTime())) {
      parts.push(date.toLocaleDateString());
    }
  }
  return parts.join(' | ');
}

function sectionIcon(iconName: string) {
  const normalized = iconName.toLowerCase();
  if (normalized === 'blocks') return <Blocks size={22} />;
  if (normalized === 'briefcase') return <BriefcaseBusiness size={22} />;
  if (normalized === 'code') return <Code2 size={22} />;
  if (normalized === 'file-text') return <FileText size={22} />;
  return <Sparkles size={22} />;
}

function navIcon(iconName: string, theme: ThemeMode) {
  const normalized = iconName.toLowerCase();
  if (normalized === 'github') return <Github size={20} />;
  if (normalized === 'mail') return <Mail size={20} />;
  if (normalized === 'lock') return <LockKeyhole size={20} />;
  if (normalized === 'copy') return <Copy size={20} />;
  if (normalized === 'sparkles') return <Sparkles size={20} />;
  if (normalized === 'theme') return theme === 'Dark' ? <Sun size={18} /> : <MoonStar size={18} />;
  return <Sparkles size={20} />;
}

function applyThemeToRoot(theme: ThemeMode, themeAssets: ThemeAssets | null) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (!themeAssets) {
    return;
  }

  const isDark = theme === 'Dark';
  const backgroundImage = isDark
    ? themeAssets.background_image_dark_url || themeAssets.background_image_light_url
    : themeAssets.background_image_light_url || themeAssets.background_image_dark_url;

  const effectiveTheme: Record<string, string> = {
    '--main-bg-image': backgroundImage ? `url('${backgroundImage}')` : 'none',
    '--page-bg': isDark ? themeAssets.page_bg_dark : themeAssets.page_bg_light,
    '--bg-blur': `${isDark ? themeAssets.bg_blur_dark : themeAssets.bg_blur_light}px`,
    '--bg-scale': isDark ? themeAssets.bg_scale_dark : themeAssets.bg_scale_light,
    '--card-bg': isDark ? themeAssets.card_bg_dark : themeAssets.card_bg_light,
    '--card-hover': isDark ? themeAssets.card_hover_dark : themeAssets.card_hover_light,
    '--gradient': isDark ? themeAssets.gradient_dark : themeAssets.gradient_light,
    '--accent': isDark ? themeAssets.accent_dark : themeAssets.accent_light,
    '--timeline-dot': themeAssets.timeline_dot_color,
    '--timeline-border': isDark ? themeAssets.timeline_border_dark : themeAssets.timeline_border_light,
    '--overlay': isDark ? themeAssets.overlay_dark : themeAssets.overlay_light,
  };

  Object.entries(effectiveTheme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function mapSectionItems(section: ContentSection | undefined): CardItem[] {
  if (!section) {
    return [];
  }
  return section.items
    .filter((item: ContentItem) => item.is_active !== false)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item: ContentItem) => ({
      title: item.title,
      description: shortenText(item.description, 110),
      href: item.href || undefined,
      image: item.image_url || undefined,
      badge: item.badge || undefined,
      meta: item.note || undefined,
      openInNewTab: item.open_in_new_tab,
    }));
}

function mapArticleItems(items: Article[]): CardItem[] {
  return items
    .filter((item) => item.is_published)
    .map((item) => ({
      title: item.title,
      description: shortenText(item.summary, 110),
      badge: item.slug.slice(0, 12).toUpperCase(),
      meta: formatArticleMeta(item),
    }));
}

function Section({
  title,
  icon,
  cards,
  compact = false,
}: {
  title: string;
  icon: ReactNode;
  cards: CardItem[];
  compact?: boolean;
}) {
  if (!cards.length) {
    return null;
  }

  return (
    <section>
      <h2 className="section-title">{icon}{title}</h2>
      <div className="project-list">
        {cards.map((item) => {
          const content = (
            <>
              <div className="project-left">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.meta ? <span className="project-meta-line">{item.meta}</span> : null}
              </div>
              <div className="project-right">
                {item.image ? (
                  <img src={item.image} alt={`${item.title} icon`} loading="lazy" />
                ) : (
                  <span className="project-badge">{item.badge || item.title.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </>
          );

          if (item.href) {
            return (
              <a
                key={`${title}-${item.title}`}
                className={`project-item ${compact ? 'compact' : ''}`}
                href={item.href}
                target={item.openInNewTab === false ? undefined : '_blank'}
                rel={item.openInNewTab === false ? undefined : 'noreferrer'}
              >
                {content}
              </a>
            );
          }

          return (
            <article key={`${title}-${item.title}`} className={`project-item ${compact ? 'compact' : ''}`}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>('Light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [homeError, setHomeError] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeState') as ThemeMode | null;
    if (savedTheme === 'Dark' || savedTheme === 'Light') {
      setTheme(savedTheme);
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('Dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeState', theme);
    applyThemeToRoot(theme, overview?.theme_assets || null);
  }, [overview?.theme_assets, theme]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = window.setTimeout(() => setToastMessage(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    let cancelled = false;

    async function readConfig() {
      try {
        const response = await loadSiteConfig();
        if (cancelled) {
          return;
        }
        startTransition(() => {
          setOverview(response);
          setHomeError('');
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        setHomeError(error instanceof Error ? error.message : '配置读取失败');
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === 'visible') {
        void readConfig();
      }
    }

    function refreshFromEditor() {
      void readConfig();
    }

    void readConfig();
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener(SITE_CONFIG_UPDATED_EVENT, refreshFromEditor);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener(SITE_CONFIG_UPDATED_EVENT, refreshFromEditor);
    };
  }, []);

  const site = overview?.site;
  const hero = overview?.hero;
  const sections = overview?.sections || [];
  const sitesSection = sections.find((item) => item.section_key === 'sites');
  const projectsSection = sections.find((item) => item.section_key === 'projects');
  const pluginsSection = sections.find((item) => item.section_key === 'plugins');
  const articlesSection = sections.find((item) => item.section_key === 'articles');

  const siteCards = useMemo(() => mapSectionItems(sitesSection), [sitesSection]);
  const projectCards = useMemo(() => mapSectionItems(projectsSection), [projectsSection]);
  const pluginCards = useMemo(() => mapSectionItems(pluginsSection), [pluginsSection]);
  const articleCards = useMemo(() => mapArticleItems(overview?.articles || []), [overview?.articles]);

  async function handleCopy(value: string | null) {
    if (!value) {
      setToastMessage('当前没有可复制的内容');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setToastMessage('已复制到剪贴板');
    } catch {
      setToastMessage(`复制失败：${value}`);
    }
  }

  const topIcons = useMemo(() => {
    return (overview?.icons || [])
      .filter((item: NavIcon) => item.is_active !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item: NavIcon) => item.action_type === 'admin' ? { ...item, href: '/admin' } : item);
  }, [overview?.icons]);

  const pageVars = useMemo<CSSProperties>(() => ({
    ['--accent' as string]: overview?.theme_assets
      ? (theme === 'Dark' ? overview.theme_assets.accent_dark : overview.theme_assets.accent_light)
      : '#747bff',
    ['--timeline-dot' as string]: overview?.theme_assets?.timeline_dot_color || '#aaffcd',
  }), [overview?.theme_assets, theme]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="simon-page" style={pageVars}>
      <button
        type="button"
        className="mobile-menu-btn"
        aria-label="Open sidebar"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen ? (
        <button
          type="button"
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <div className="simon-main">
        <aside className={`simon-left ${mobileMenuOpen ? 'active' : ''}`}>
          <img
            className="logo"
            src={site?.avatar_url || hero?.skills_image_url || 'https://via.placeholder.com/320'}
            alt={`${site?.site_name || 'avatar'} avatar`}
          />

          <div className="left-card left-des">
            <p>Location: {site?.location || 'Your City'}</p>
            <p>Role: {hero?.role_title || 'Engineer'}</p>
          </div>

          <div className="left-card left-tag-list">
            {(overview?.tags || [])
              .filter((item) => item.is_active !== false)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <span key={item.id} className="left-tag-item">{item.label}</span>
              ))}
          </div>

          <ul className="left-card timeline">
            {(overview?.timeline || [])
              .filter((item) => item.is_active !== false)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item, index) => (
                <li key={item.id} className="timeline-item">
                  <span className={`focus-dot ${index === 0 ? 'active' : ''}`} aria-hidden="true" />
                  <div>
                    <p>{item.title}</p>
                    {item.time_label ? <time>{item.time_label}</time> : null}
                  </div>
                </li>
              ))}
          </ul>
        </aside>

        <main id="main-content" className="simon-right" onClick={() => setMobileMenuOpen(false)}>
          <header>
            <img
              className="mobile-logo"
              src={site?.avatar_url || 'https://via.placeholder.com/320'}
              alt={`${site?.site_name || 'avatar'} avatar`}
            />
            <h1 className="welcome">
              {hero?.headline_prefix || "Hello I'm"} <span className="gradient-text">{hero?.headline_highlight || site?.site_name || 'Your Name'}</span>
            </h1>
            <p className="description">
              <span className="text-bg">{hero?.role_title || 'Engineer'}</span>
            </p>
            <p className="description">
              <span className="text-bg">{hero?.intro_summary || 'Write your short introduction here.'}</span>
            </p>
            <p className="description">{hero?.opportunity_statement || 'Keep building in public.'}</p>

            {homeError ? (
              <p className="description">
                <span className="text-bg">配置加载失败：{homeError}</span>
              </p>
            ) : null}

            <div className="icon-container">
              {topIcons.map((item) => {
                const icon = navIcon(item.icon_name, theme);
                if (item.action_type === 'link' || item.action_type === 'admin') {
                  return (
                    <a
                      key={item.id}
                      className="icon-item"
                      href={item.href || '#'}
                      target={item.action_type === 'link' ? '_blank' : undefined}
                      rel={item.action_type === 'link' ? 'noreferrer' : undefined}
                    >
                      {icon}
                      <span>{item.title}</span>
                    </a>
                  );
                }
                if (item.action_type === 'theme_toggle') {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="icon-item switch-item"
                      onClick={() => setTheme((prev) => (prev === 'Dark' ? 'Light' : 'Dark'))}
                    >
                      {icon}
                      <span>{item.title}</span>
                    </button>
                  );
                }
                if (item.action_type === 'copy') {
                  return (
                    <button key={item.id} type="button" className="icon-item" onClick={() => void handleCopy(item.payload)}>
                      {icon}
                      <span>{item.title}</span>
                    </button>
                  );
                }
                return (
                  <button key={item.id} type="button" className="icon-item" onClick={() => setPopupImage(item.payload || null)}>
                    {icon}
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>

            {(hero?.snake_light_url || hero?.snake_dark_url) ? (
              <div className="snake-wrap">
                <img
                  src={theme === 'Dark' ? (hero?.snake_dark_url || hero?.snake_light_url || '') : (hero?.snake_light_url || hero?.snake_dark_url || '')}
                  alt="Contribution snake"
                  loading="lazy"
                />
              </div>
            ) : null}
          </header>

          <Section title={sitesSection?.title || 'My Sites'} icon={sectionIcon(sitesSection?.icon_name || 'blocks')} cards={siteCards} />
          <Section title={projectsSection?.title || 'Projects'} icon={sectionIcon(projectsSection?.icon_name || 'briefcase')} cards={projectCards} />
          <Section title={articlesSection?.title || 'Articles'} icon={sectionIcon(articlesSection?.icon_name || 'file-text')} cards={articleCards} compact />
          <Section title={pluginsSection?.title || 'Plugins'} icon={sectionIcon(pluginsSection?.icon_name || 'code')} cards={pluginCards} compact />

          {hero?.skills_image_url ? (
            <section>
              <h2 className="section-title"><Sparkles size={22} /> Skills</h2>
              <div className="skill-wrap">
                <img src={hero.skills_image_url} alt="Skill matrix" loading="lazy" />
              </div>
            </section>
          ) : null}
        </main>
      </div>

      <footer>
        {site?.footer_brand || site?.site_name || 'Your Name'} {currentYear}
        {' | '}
        <a href={site?.footer_site_url || '#'} target="_blank" rel="noreferrer">
          {site?.footer_site_label || 'Your Home'}
        </a>
      </footer>

      {popupImage ? (
        <button type="button" className="popup-mask" onClick={() => setPopupImage(null)}>
          <img src={popupImage} alt="Preview" onClick={(event: MouseEvent<HTMLImageElement>) => event.stopPropagation()} />
        </button>
      ) : null}

      {toastMessage ? <div className="toast-notification">{toastMessage}</div> : null}
    </div>
  );
}
