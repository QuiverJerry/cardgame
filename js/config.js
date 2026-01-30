/* ========================================
   游戏配置和常量
   ======================================== */

// 图标映射
const ICONS = {
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    psychic: '💖',
    dark: '⚫',
    masterball: '🏐'
};

// 颜色映射（中文到英文）
const COLOR_MAP = {
    '红': 'fire',
    '蓝': 'water',
    '黄': 'electric',
    '紫': 'psychic',
    '粉': 'psychic',
    '黑': 'dark'
};

// 市场槽位配置（传说/稀有各展示 1 张）
const MARKET_SLOTS = {
    legends: 1,
    rares: 1,
    lvl3: 4,
    lvl2: 4,
    lvl1: 4
};

// 市场行标签
const MARKET_LABELS = {
    legends: '传说',
    rares: '稀有',
    lvl3: '最终',
    lvl2: '二阶',
    lvl1: '一阶'
};

// 长按延迟时间（毫秒）
const LONG_PRESS_DELAY = 500;

// 代币类型列表
const TOKEN_TYPES = ['fire', 'water', 'electric', 'psychic', 'dark', 'masterball'];

// 玩家数量对应的代币数量
const TOKEN_COUNT_BY_PLAYERS = {
    2: 4,
    3: 5,
    4: 7
};
