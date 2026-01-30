# 宝可梦璀璨宝石 - 模块化版本

## 项目结构

```
pokemon-game/
├── index.html          # 主HTML文件
├── css/
│   ├── base.css       # 基础样式和变量
│   ├── layout.css     # 布局样式
│   ├── card.css       # 卡牌样式
│   └── components.css # 组件样式
├── js/
│   ├── config.js      # 配置和常量
│   ├── data.js        # 游戏数据
│   ├── state.js       # 状态管理
│   ├── network.js     # 网络通信
│   ├── game.js        # 游戏逻辑
│   ├── ui.js          # UI渲染
│   └── main.js        # 主入口
└── README.md          # 本文件
```

## 使用方法

1. 在浏览器中打开 `index.html`
2. 输入服务器地址、房间号和用户名
3. 点击"进入赛场"开始游戏

## 通过 GitHub Pages 打开

1. 在仓库 **Settings** → **Pages**
2. **Source** 选 **Deploy from a branch**
3. **Branch** 选 **main**，文件夹选 **/ (root)**，保存
4. 等待一两分钟后，在浏览器打开：  
   **https://quiverjerry.github.io/cardgame/**

> 页面会正常加载，联机需要后端。可选：**本地运行** / **内网穿透** / **云端部署**（见下）。

### 不用本地跑服务器：把后端部署到云端

把 `server.py` 部署到 **Railway** 或 **Render** 后，所有人打开 GitHub Pages 页面、填云端地址即可联机，无需任何人本机运行。

**Railway（推荐，有免费额度）**

1. 打开 [railway.app](https://railway.app)，用 GitHub 登录。
2. **New Project** → **Deploy from GitHub repo**，选你的 `cardgame` 仓库。
3. 添加 **Web Service**，根目录选项目根（含 `server.py`、`requirements.txt`、`Procfile`）。
4. Railway 会自动用 `Procfile` 启动：`uvicorn server:application --host 0.0.0.0 --port $PORT`。
5. 在 **Settings** → **Networking** 里点 **Generate Domain**，得到公网地址，例如 `https://cardgame-xxx.up.railway.app`。
6. **游戏里填的服务器地址**：把 `https://` 改成 `wss://`，路径不变，例如  
   `wss://cardgame-xxx.up.railway.app`  
   （不要带末尾 `/`）。所有人打开 [GitHub Pages](https://quiverjerry.github.io/cardgame/)，在登录页填这个地址即可联机。

**Render**

1. 打开 [render.com](https://render.com)，用 GitHub 登录。
2. **New** → **Web Service**，连到 `cardgame` 仓库。
3. **Build Command** 留空或填 `pip install -r requirements.txt`，**Start Command** 填：  
   `uvicorn server:application --host 0.0.0.0 --port $PORT`
4. 创建后得到地址如 `https://cardgame-xxx.onrender.com`，游戏里填 **wss://cardgame-xxx.onrender.com** 即可。

**本地 / 内网联机**

- **同一 WiFi**：一人运行 `python server.py`，其他人填 `ws://运行服务器的电脑IP:8001`。
- **异地**：用 [ngrok](https://ngrok.com/)、[frp](https://github.com/fatedier/frp) 等把本机 8001 暴露为公网，或按上面步骤部署到 Railway/Render。

## 模块说明

- **config.js**: 游戏配置、图标、颜色映射等常量
- **data.js**: 卡牌数据定义
- **state.js**: 游戏状态管理
- **network.js**: WebSocket通信
- **game.js**: 核心游戏逻辑（重置、回合、购买等）
- **ui.js**: UI渲染和交互
- **main.js**: 初始化和事件绑定