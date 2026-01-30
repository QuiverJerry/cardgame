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

## 模块说明

- **config.js**: 游戏配置、图标、颜色映射等常量
- **data.js**: 卡牌数据定义
- **state.js**: 游戏状态管理
- **network.js**: WebSocket通信
- **game.js**: 核心游戏逻辑（重置、回合、购买等）
- **ui.js**: UI渲染和交互
- **main.js**: 初始化和事件绑定