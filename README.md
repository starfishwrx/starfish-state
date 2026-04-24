# starfish-state

A pure frontend single-page application.

## Features

- Homepage display page
- `/admin` configuration page
- `public/site-config.json` for local configuration — no backend required

## Getting Started

```bash
npm install
npm run dev
```

Local URLs:
- Homepage: `http://localhost:5173/`
- Config page: `http://localhost:5173/admin`

## Configuration

The homepage content is driven by [public/site-config.json](./public/site-config.json). Edit this file directly, or use the `/admin` page to:

- Edit JSON
- Save to browser localStorage
- Import JSON
- Export JSON
- Reset to default

After saving locally, the homepage will immediately reflect the new configuration. Once verified, replace the project's `site-config.json` with the exported version.

## Build

```bash
npm run build
```

This produces a standard Vite static build, deployable to Vercel, Netlify, GitHub Pages, or any static hosting platform.
