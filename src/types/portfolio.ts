export interface AdminUser {
  id: number;
  username: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  headline_prefix: string;
  headline_highlight: string;
  role_title: string;
  intro_summary: string;
  opportunity_statement: string;
  location: string | null;
  contact_email: string;
  github_url: string | null;
  avatar_url: string | null;
  sponsor_image_url: string | null;
  qq_image_url: string | null;
  footer_brand: string;
  footer_site_url: string | null;
  footer_site_label: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  skills_image_url: string | null;
  snake_light_url: string | null;
  snake_dark_url: string | null;
  background_image_light_url: string | null;
  background_image_dark_url: string | null;
  page_bg_light: string;
  page_bg_dark: string;
  card_bg_light: string;
  card_bg_dark: string;
  card_hover_light: string;
  card_hover_dark: string;
  accent_light: string;
  accent_dark: string;
  gradient_light: string;
  gradient_dark: string;
  timeline_dot_color: string;
  timeline_border_light: string;
  timeline_border_dark: string;
  overlay_light: string;
  overlay_dark: string;
  bg_blur_light: number;
  bg_blur_dark: number;
  bg_scale_light: string;
  bg_scale_dark: string;
  created_at: string;
  updated_at: string;
}

export interface NavIcon {
  id: number;
  title: string;
  icon_name: string;
  action_type: string;
  href: string | null;
  payload: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  id: number;
  section_key: string;
  title: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: number;
  category_id: number;
  title: string;
  description: string;
  href: string | null;
  image_url: string | null;
  badge: string | null;
  note: string | null;
  open_in_new_tab: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineItem {
  id: number;
  title: string;
  time_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TagItem {
  id: number;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  reading_minutes: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: number;
  original_filename: string;
  storage_key: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  purpose: string | null;
  storage_backend: string;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: number;
  section_key: string;
  title: string;
  icon_name: string;
  sort_order: number;
  items: ContentItem[];
}

export interface SiteOverview {
  site_name: string;
  avatar_url: string | null;
  location: string | null;
  contact_email: string;
  github_url: string | null;
  footer_brand: string;
  footer_site_url: string | null;
  footer_site_label: string;
}

export interface HeroOverview {
  headline_prefix: string;
  headline_highlight: string;
  role_title: string;
  intro_summary: string;
  opportunity_statement: string;
  sponsor_image_url: string | null;
  qq_image_url: string | null;
  snake_light_url: string | null;
  snake_dark_url: string | null;
  skills_image_url: string | null;
}

export interface ThemeAssets {
  background_image_light_url: string | null;
  background_image_dark_url: string | null;
  page_bg_light: string;
  page_bg_dark: string;
  card_bg_light: string;
  card_bg_dark: string;
  card_hover_light: string;
  card_hover_dark: string;
  accent_light: string;
  accent_dark: string;
  gradient_light: string;
  gradient_dark: string;
  timeline_dot_color: string;
  timeline_border_light: string;
  timeline_border_dark: string;
  overlay_light: string;
  overlay_dark: string;
  bg_blur_light: number;
  bg_blur_dark: number;
  bg_scale_light: string;
  bg_scale_dark: string;
}

export interface OverviewResponse {
  site: SiteOverview;
  hero: HeroOverview;
  icons: NavIcon[];
  sections: ContentSection[];
  timeline: TimelineItem[];
  tags: TagItem[];
  articles: Article[];
  theme_assets: ThemeAssets;
}

export interface NavIconPayload {
  id?: number | null;
  title: string;
  icon_name: string;
  action_type: string;
  href: string | null;
  payload: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ContentCategoryPayload {
  id?: number | null;
  section_key: string;
  title: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface ContentItemPayload {
  id?: number | null;
  category_id: number;
  title: string;
  description: string;
  href: string | null;
  image_url: string | null;
  badge: string | null;
  note: string | null;
  open_in_new_tab: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface TimelineItemPayload {
  id?: number | null;
  title: string;
  time_label: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TagItemPayload {
  id?: number | null;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export interface ArticlePayload {
  title: string;
  slug: string;
  summary: string;
  content: string;
  reading_minutes: number;
  is_published: boolean;
  published_at: string | null;
}
