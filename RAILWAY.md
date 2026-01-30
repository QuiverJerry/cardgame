# Railway 部署 cardgame 后端

## 一、先确保代码在 GitHub

1. 打开 https://github.com/QuiverJerry/cardgame  
2. 确认仓库里有：`server.py`、`requirements.txt`、`Procfile`、`index.html`、`css/`、`js/` 等  
3. 若仓库是空的或没有最新代码，在项目目录执行：
   ```bash
   cd "/Users/xurui/Desktop/聆泫阁/01_攻玉坊/璀璨宝石/new"
   git add .
   git commit -m "部署到 Railway"
   git push origin main
   ```

---

## 二、在 Railway 里连上仓库（解决 “no repo”）

1. 打开 **https://railway.app**，用 **GitHub** 登录  
2. 若提示 “no repo” 或看不到 `cardgame`：
   - 点左上角 **Dashboard** 回到首页  
   - 点右上角头像 → **Account Settings**（或 **Team Settings**）  
   - 找 **Integrations** / **Connected Accounts** → **GitHub**  
   - 点 **Configure** 或 **Manage**，在 GitHub 里勾选允许 Railway 访问 **QuiverJerry/cardgame**（或 “All repositories”）  
   - 保存后回到 Railway  
3. 点 **New Project**  
4. 选 **Deploy from GitHub repo**  
5. 在列表里选 **QuiverJerry/cardgame**（不要选 “no repo”）  
6. 选 **main** 分支，确认  
7. Railway 会创建一个 **Service**，并开始从 GitHub 拉代码部署  

---

## 三、确认是 Web Service 并生成公网地址

1. 进入项目后，会看到一个 **Service**（卡片/方块）  
2. 点进这个 **Service**（不是顶部的 “Project Settings”）  
3. 点上方 **Settings**（或右侧齿轮）  
4. 在 **Networking** 区域点 **Generate Domain**  
5. 会得到一个地址，例如：`cardgame-production-xxxx.up.railway.app`  
6. 完整 URL 是：**https://**`cardgame-production-xxxx.up.railway.app`

---

## 四、游戏里填的服务器地址

- 页面是 **HTTPS**，所以 WebSocket 必须用 **wss**
- 把上面的 **https** 改成 **wss**，**路径不变、不要加末尾斜杠**

例如：

- Railway 给的：`https://cardgame-production-xxxx.up.railway.app`  
- 游戏里填：**`wss://cardgame-production-xxxx.up.railway.app`**

所有人打开：**https://quiverjerry.github.io/cardgame/**  
在登录页「服务器地址」里填这个 `wss://...`，即可联机。

---

## 五、若部署失败（Build / Start 报错）

1. 在 Service 里点 **Deployments** → 点最新一次部署 → 看 **Build Logs** / **Deploy Logs**  
2. 确认根目录有：
   - `server.py`
   - `requirements.txt`（内容含 `uvicorn[standard]>=0.23.0`）
   - `Procfile`（内容：`web: uvicorn server:application --host 0.0.0.0 --port $PORT`）  
3. 若 Railway 没用 Procfile，在 Service 的 **Settings** → **Deploy** 里把 **Start Command** 设为：  
   `uvicorn server:application --host 0.0.0.0 --port $PORT`

---

**总结**：  
- “no repo” → 去 **Account/Team** 的 **Integrations** 里给 Railway 开 GitHub 仓库权限，再选 **cardgame**。  
- 公网地址 → 在 **某个 Service** 的 **Settings → Networking → Generate Domain**，不是 Project Settings。  
- 游戏里填 **wss://** 开头的那个地址。
