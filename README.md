# starfish-state

一个纯前端的单页面应用。

## 功能

- 首页展示页面
- `/admin` 配置编辑页面
- `public/site-config.json` 本地配置文件 — 无需后端

## 快速开始

```bash
npm install
npm run dev
```

本地访问地址：
- 首页：`http://localhost:5173/`
- 配置页：`http://localhost:5173/admin`

## 配置方式

首页内容由 [public/site-config.json](./public/site-config.json) 驱动。直接编辑该文件，或在 `/admin` 页面中：

- 编辑 JSON
- 保存到浏览器本地存储
- 导入 JSON
- 导出 JSON
- 恢复默认配置

本地保存后，首页会立即读取新配置。确认无误后，将导出的 `site-config.json` 替换项目中的同名文件即可。

## 构建

```bash
npm run build
```

产物为标准 Vite 静态构建，可直接部署到 Vercel、Netlify、GitHub Pages 或任意静态托管平台。
