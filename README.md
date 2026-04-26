# starfish-state

这是一个纯前端的个人网站首页项目。

现在这套仓库只保留了：

- 首页展示页面
- `/admin` 配置编辑页
- `public/site-config.json` 静态配置文件

它不再依赖：

- 后端服务
- 数据库
- 登录鉴权
- 运行时上传接口

## 开发

```bash
npm install
npm run dev
```

本地打开：

- 首页：`/`
- 配置台：`/admin`

## 配置方式

首页内容由 [public/site-config.json](./public/site-config.json) 驱动。

你可以直接修改这个文件，也可以在 `/admin` 里：

- 编辑 JSON
- 保存到浏览器本地
- 导入 JSON
- 导出 JSON
- 恢复默认配置

本地保存后，首页会立即读取新配置。确认无误后，再把导出的 `site-config.json` 替换回项目里的同名文件即可。

## 构建

```bash
npm run build
```

这是一个标准的 Vite 静态站，可以直接部署到 Vercel、Netlify、GitHub Pages 或任意静态托管平台。
