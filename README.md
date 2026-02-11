# 上海红色景点可视化 App

一个纯前端静态网页应用，用地图可视化上海红色景点（含四行仓库），并支持筛选、路线高亮和时间线浏览。

## 功能

- 地图标注上海红色景点，点击查看简介
- 免费高清底图（默认高清街道图，可切换标准街道图）
- 点击任意景点可联动显示该地点 3D 视角（可旋转/缩放）
- 3D 视图启用坐标纠偏（GCJ-02 -> WGS84）并按景点使用独立相机参数，定位更贴近真实馆址
- 关键词搜索（名称 / 简介 / 关键词）
- 按行政区、类型筛选
- 推荐路线一键高亮（建党初心线 / 抗战记忆线 / 城市人文线）
- 点击路线自动生成打卡顺序（到达/离开时间）与预计总用时
- 一键转发：系统分享或复制当前页面链接（含筛选/路线状态）
- 每个标点展示具体地址与详细介绍
- 景点列表与地图联动定位
- 历史时间线自动排序展示
- 桌面端和移动端自适应

## 数据校验

- 最近一次景点地址与馆点信息人工核验：2026-02-11（以上海官方馆方/政府/文旅来源为主）。
- 最近一次 3D 坐标纠偏与视角参数校准：2026-02-11。

## 免费方案说明

- 当前版本不需要 Apple Developer Program，不需要任何付费账号。
- 直接打开网页即可加载地图与标点，不需要配置 token。

## 运行方式

1. 进入目录：

```bash
cd '/Users/nafyoung/Documents/New project/shanghai-red-landmarks-app'
```

2. 启动本地静态服务（推荐）：

```bash
python3 -m http.server 5173
```

3. 浏览器打开：

```text
http://localhost:5173
```

也可以直接双击 `index.html` 打开，但地图瓦片在某些浏览器设置下可能受限制，建议使用本地服务。

## 分享说明

- 点击页面上的 `转发给朋友` 可直接调用系统分享（支持时）或自动复制链接。
- 链接会包含当前筛选、选中路线和地图视角，朋友打开后可还原同一视图。
- 如果你分享的是 `localhost` 链接，朋友通常无法直接访问；需要把项目部署到可公网访问地址后再分享。

## GitHub Pages 部署（推荐稳定分享）

项目已内置 GitHub Pages 自动发布工作流：`/Users/nafyoung/Documents/New project/shanghai-red-landmarks-app/.github/workflows/deploy-pages.yml`

1. 在 GitHub 新建一个空仓库（不要勾选初始化 README），例如 `shanghai-red-landmarks-app`。
2. 在本地执行：

```bash
cd '/Users/nafyoung/Documents/New project/shanghai-red-landmarks-app'
./publish-github-pages.sh https://github.com/<你的GitHub用户名>/<仓库名>.git
```

3. 首次发布后，到仓库 `Settings -> Pages` 检查 Source 是否为 `GitHub Actions`。
4. 等待 Actions 运行完成后，访问：

```text
https://<你的GitHub用户名>.github.io/<仓库名>/
```
