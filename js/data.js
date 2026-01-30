/* ========================================
   游戏卡牌数据
   ======================================== */

const RAW_CARDS_DATA = {
        lvl1: [
            // 红色系
            { name: '杰尼龟', points: 1, gem: 'fire', cost: { fire: 4 }, evoTo: '卡咪龟', evoFee: '需3蓝' },
            { name: '杰尼龟', points: 1, gem: 'fire', cost: { water: 3, psychic: 2, electric: 1 }, evoTo: '卡咪龟', evoFee: '需3蓝' },
            { name: '腕力', points: 0, gem: 'fire', cost: { electric: 2, psychic: 1, dark: 1 }, evoTo: '豪力', evoFee: '需3黄' },
            { name: '腕力', points: 0, gem: 'fire', cost: { water: 1, electric: 1, psychic: 1, fire: 1 }, evoTo: '豪力', evoFee: '需3黄' },
            { name: '喇叭芽', points: 0, gem: 'fire', cost: { dark: 2, water: 1 }, evoTo: '口呆花', evoFee: '需2紫' },
            { name: '喇叭芽', points: 0, gem: 'fire', cost: { psychic: 2, fire: 2 }, evoTo: '口呆花', evoFee: '需2紫' },
            { name: '喇叭芽', points: 0, gem: 'fire', cost: { electric: 3 }, evoTo: '口呆花', evoFee: '需2紫' },
            // 蓝色系
            { name: '小火龙', points: 1, gem: 'water', cost: { water: 4 }, evoTo: '火恐龙', evoFee: '需3黄' },
            { name: '小火龙', points: 1, gem: 'water', cost: { dark: 3, fire: 2 }, evoTo: '火恐龙', evoFee: '需3黄' },
            { name: '小拳石', points: 0, gem: 'water', cost: { fire: 2, electric: 1, water: 1 }, evoTo: '隆隆石', evoFee: '需3紫' },
            { name: '小拳石', points: 0, gem: 'water', cost: { dark: 1, electric: 1, psychic: 1 }, evoTo: '隆隆石', evoFee: '需3紫' },
            { name: '波波', points: 0, gem: 'water', cost: { electric: 2, dark: 1 }, evoTo: '比比鸟', evoFee: '需2红' },
            { name: '波波', points: 0, gem: 'water', cost: { water: 2, fire: 2 }, evoTo: '比比鸟', evoFee: '需2红' },
            { name: '波波', points: 0, gem: 'water', cost: { psychic: 3 }, evoTo: '比比鸟', evoFee: '需2红' },
            // 黄色系
            { name: '妙蛙种子', points: 1, gem: 'electric', cost: { electric: 4 }, evoTo: '妙蛙草', evoFee: '需3紫' },
            { name: '妙蛙种子', points: 1, gem: 'electric', cost: { fire: 3, dark: 2 }, evoTo: '妙蛙草', evoFee: '需3紫' },
            { name: '鬼斯', points: 0, gem: 'electric', cost: { psychic: 2, dark: 1, fire: 1 }, evoTo: '鬼斯通', evoFee: '需3黑' },
            { name: '鬼斯', points: 0, gem: 'electric', cost: { water: 1, fire: 1, psychic: 1 }, evoTo: '鬼斯通', evoFee: '需3黑' },
            { name: '尼多兰', points: 0, gem: 'electric', cost: { fire: 2, psychic: 1 }, evoTo: '尼多娜', evoFee: '需2蓝' },
            { name: '尼多兰', points: 0, gem: 'electric', cost: { water: 2, electric: 2 }, evoTo: '尼多娜', evoFee: '需2蓝' },
            { name: '尼多兰', points: 0, gem: 'electric', cost: { dark: 3 }, evoTo: '尼多娜', evoFee: '需2蓝' },
            // 紫色系
            { name: '凯西', points: 1, gem: 'psychic', cost: { psychic: 4 }, evoTo: '勇基拉', evoFee: '需3红' },
            { name: '凯西', points: 1, gem: 'psychic', cost: { water: 3, electric: 2 }, evoTo: '勇基拉', evoFee: '需3红' },
            { name: '绿毛虫', points: 0, gem: 'psychic', cost: { dark: 2, water: 1, electric: 1 }, evoTo: '铁甲蛹', evoFee: '需3蓝' },
            { name: '绿毛虫', points: 0, gem: 'psychic', cost: { water: 1, electric: 1, fire: 1 }, evoTo: '铁甲蛹', evoFee: '需3蓝' },
            { name: '蚊香蝌蚪', points: 0, gem: 'psychic', cost: { water: 2, electric: 1 }, evoTo: '蚊香君', evoFee: '需2黑' },
            { name: '蚊香蝌蚪', points: 0, gem: 'psychic', cost: { psychic: 2, dark: 2 }, evoTo: '蚊香君', evoFee: '需2黑' },
            { name: '蚊香蝌蚪', points: 0, gem: 'psychic', cost: { fire: 3 }, evoTo: '蚊香君', evoFee: '需2黑' },
            // 黑色系
            { name: '迷你龙', points: 1, gem: 'dark', cost: { dark: 4 }, evoTo: '哈克龙', evoFee: '需3蓝' },
            { name: '迷你龙', points: 1, gem: 'dark', cost: { water: 3, fire: 2 }, evoTo: '哈克龙', evoFee: '需3蓝' },
            { name: '独角虫', points: 0, gem: 'dark', cost: { water: 2, fire: 1, psychic: 1 }, evoTo: '铁壳蛹', evoFee: '需3红' },
            { name: '独角虫', points: 0, gem: 'dark', cost: { fire: 1, electric: 1, psychic: 1 }, evoTo: '铁壳蛹', evoFee: '需3红' },
            { name: '走路草', points: 0, gem: 'dark', cost: { psychic: 2, fire: 1 }, evoTo: '臭臭花', evoFee: '需2黄' },
            { name: '走路草', points: 0, gem: 'dark', cost: { electric: 2, dark: 2 }, evoTo: '臭臭花', evoFee: '需2黄' },
            { name: '走路草', points: 0, gem: 'dark', cost: { water: 3 }, evoTo: '臭臭花', evoFee: '需2黄' }
        ],
        lvl2: [
            { name: '卡咪龟', points: 3, gem: 'fire', cost: { water: 4 }, evoFrom: '杰尼龟', evoTo: '水箭龟', evoFee: '需4蓝' },
            { name: '卡咪龟', points: 3, gem: 'fire', cost: { fire: 6 }, evoFrom: '杰尼龟', evoTo: '水箭龟', evoFee: '需4蓝' },
            { name: '豪力', points: 2, gem: 'fire', cost: { fire: 5, psychic: 2 }, evoFrom: '腕力', evoTo: '怪力', evoFee: '需3蓝' },
            { name: '豪力', points: 2, gem: 'fire', cost: { electric: 4, dark: 2 }, evoFrom: '腕力', evoTo: '怪力', evoFee: '需3蓝' },
            { name: '口呆花', points: 1, gem: 'fire', cost: { dark: 2, fire: 2, electric: 2 }, evoFrom: '喇叭芽', evoTo: '大食花', evoFee: '需4紫' },
            { name: '口呆花', points: 1, gem: 'fire', cost: { psychic: 3, electric: 2 }, evoFrom: '喇叭芽', evoTo: '大食花', evoFee: '需4紫' },
            { name: '火恐龙', points: 3, gem: 'water', cost: { water: 6 }, evoFrom: '小火龙', evoTo: '喷火龙', evoFee: '需4红' },
            { name: '火恐龙', points: 3, gem: 'water', cost: { electric: 4, dark: 4 }, evoFrom: '小火龙', evoTo: '喷火龙', evoFee: '需4红' },
            { name: '隆隆石', points: 2, gem: 'water', cost: { water: 5, fire: 2 }, evoFrom: '小拳石', evoTo: '隆隆岩', evoFee: '需3黑' },
            { name: '隆隆石', points: 2, gem: 'water', cost: { psychic: 4, electric: 2 }, evoFrom: '小拳石', evoTo: '隆隆岩', evoFee: '需3黑' },
            { name: '比比鸟', points: 1, gem: 'water', cost: { water: 3, psychic: 2, fire: 2 }, evoFrom: '波波', evoTo: '大比鸟', evoFee: '需4红' },
            { name: '比比鸟', points: 1, gem: 'water', cost: { fire: 3, electric: 2 }, evoFrom: '波波', evoTo: '大比鸟', evoFee: '需4红' },
            { name: '妙蛙草', points: 3, gem: 'electric', cost: { electric: 6 }, evoFrom: '妙蛙种子', evoTo: '妙蛙花', evoFee: '需4蓝' },
            { name: '妙蛙草', points: 3, gem: 'electric', cost: { fire: 4, psychic: 4 }, evoFrom: '妙蛙种子', evoTo: '妙蛙花', evoFee: '需4蓝' },
            { name: '鬼斯通', points: 2, gem: 'electric', cost: { psychic: 5, dark: 2 }, evoFrom: '鬼斯', evoTo: '耿鬼', evoFee: '需3红' },
            { name: '鬼斯通', points: 2, gem: 'electric', cost: { dark: 4, psychic: 2 }, evoFrom: '鬼斯', evoTo: '耿鬼', evoFee: '需3红' },
            { name: '尼多娜', points: 1, gem: 'electric', cost: { electric: 3, psychic: 2, fire: 2 }, evoFrom: '尼多兰', evoTo: '尼多后', evoFee: '需4蓝' },
            { name: '尼多娜', points: 1, gem: 'electric', cost: { water: 3, psychic: 2 }, evoFrom: '尼多兰', evoTo: '尼多后', evoFee: '需4蓝' },
            { name: '勇基拉', points: 3, gem: 'psychic', cost: { psychic: 6 }, evoFrom: '凯西', evoTo: '胡地', evoFee: '需4黑' },
            { name: '勇基拉', points: 3, gem: 'psychic', cost: { fire: 4, electric: 4 }, evoFrom: '凯西', evoTo: '胡地', evoFee: '需4黑' },
            { name: '铁甲蛹', points: 2, gem: 'psychic', cost: { psychic: 5, dark: 2 }, evoFrom: '绿毛虫', evoTo: '巴大蝶', evoFee: '需3黄' },
            { name: '铁甲蛹', points: 2, gem: 'psychic', cost: { water: 4, fire: 2 }, evoFrom: '绿毛虫', evoTo: '巴大蝶', evoFee: '需3黄' },
            { name: '蚊香君', points: 1, gem: 'psychic', cost: { psychic: 3, water: 2, electric: 2 }, evoFrom: '蚊香蝌蚪', evoTo: '蚊香泳士', evoFee: '需4黑' },
            { name: '蚊香君', points: 1, gem: 'psychic', cost: { dark: 3, water: 2 }, evoFrom: '蚊香蝌蚪', evoTo: '蚊香泳士', evoFee: '需4黑' },
            { name: '哈克龙', points: 3, gem: 'dark', cost: { dark: 6 }, evoFrom: '迷你龙', evoTo: '快龙', evoFee: '需4黄' },
            { name: '哈克龙', points: 3, gem: 'dark', cost: { water: 4, fire: 4 }, evoFrom: '迷你龙', evoTo: '快龙', evoFee: '需4黄' },
            { name: '铁壳蛹', points: 2, gem: 'dark', cost: { dark: 5, electric: 2 }, evoFrom: '独角虫', evoTo: '大针蜂', evoFee: '需3紫' },
            { name: '铁壳蛹', points: 2, gem: 'dark', cost: { fire: 4, water: 2 }, evoFrom: '独角虫', evoTo: '大针蜂', evoFee: '需3紫' },
            { name: '臭臭花', points: 1, gem: 'dark', cost: { dark: 3, water: 2, fire: 2 }, evoFrom: '走路草', evoTo: '霸王花', evoFee: '需4黄' },
            { name: '臭臭花', points: 1, gem: 'dark', cost: { electric: 3, water: 2 }, evoFrom: '走路草', evoTo: '霸王花', evoFee: '需4黄' }
        ],
        lvl3: [
            { name: '水箭龟', points: 5, gem: 'fire', cost: { water: 7, dark: 3 }, evoFrom: '卡咪龟' },
            { name: '怪力', points: 4, gem: 'fire', cost: { electric: 6, psychic: 4 }, evoFrom: '豪力' },
            { name: '大食花', points: 3, gem: 'fire', cost: { fire: 5, dark: 2 }, evoFrom: '口呆花' },
            { name: '喷火龙', points: 5, gem: 'water', cost: { dark: 7, electric: 3 }, evoFrom: '火恐龙' },
            { name: '隆隆岩', points: 4, gem: 'water', cost: { psychic: 6, fire: 4 }, evoFrom: '隆隆石' },
            { name: '大比鸟', points: 3, gem: 'water', cost: { water: 5, dark: 2 }, evoFrom: '比比鸟' },
            { name: '妙蛙花', points: 5, gem: 'electric', cost: { fire: 7, psychic: 3 }, evoFrom: '妙蛙草' },
            { name: '耿鬼', points: 4, gem: 'electric', cost: { dark: 6, water: 4 }, evoFrom: '鬼斯通' },
            { name: '尼多后', points: 3, gem: 'electric', cost: { electric: 5, fire: 2 }, evoFrom: '尼多娜' },
            { name: '胡地', points: 5, gem: 'psychic', cost: { electric: 7, fire: 3 }, evoFrom: '勇基拉' },
            { name: '巴大蝶', points: 4, gem: 'psychic', cost: { water: 6, dark: 4 }, evoFrom: '铁甲蛹' },
            { name: '蚊香泳士', points: 3, gem: 'psychic', cost: { psychic: 5, electric: 2 }, evoFrom: '蚊香君' },
            { name: '快龙', points: 5, gem: 'dark', cost: { psychic: 7, water: 3 }, evoFrom: '哈克龙' },
            { name: '大针蜂', points: 4, gem: 'dark', cost: { fire: 6, electric: 4 }, evoFrom: '铁壳蛹' },
            { name: '霸王花', points: 3, gem: 'dark', cost: { dark: 5, water: 2 }, evoFrom: '臭臭花' }
        ],
        // 传说：有分的稀有牌，每次展示 1 张
        legends: [
            { name: '急冻鸟', points: 2, gem: 'fire', gemCount: 2, cost: { psychic: 1, fire: 3, psychic: 3, dark: 3 } },
            { name: '闪电鸟', points: 2, gem: 'water', gemCount: 2, cost: { psychic: 1, psychic: 3, water: 3, electric: 3 } },
            { name: '火焰鸟', points: 2, gem: 'electric', gemCount: 2, cost: { psychic: 1, water: 3, electric: 3, dark: 3 } },
            { name: '梦幻', points: 2, gem: 'psychic', gemCount: 2, cost: { psychic: 1, dark: 3, electric: 3, fire: 3 } },
            { name: '超梦', points: 2, gem: 'dark', gemCount: 2, cost: { psychic: 1, psychic: 3, fire: 3, water: 3 } }
        ],
        // 稀有：无分的稀有牌，每次展示 1 张
        rares: [
            { name: '化石翼龙', points: 0, gem: 'fire', gemCount: 2, cost: { psychic: 1, water: 3, psychic: 2 } },
            { name: '拉普拉斯', points: 0, gem: 'water', gemCount: 2, cost: { psychic: 1, dark: 3, water: 2 } },
            { name: '卡比兽', points: 0, gem: 'electric', gemCount: 2, cost: { psychic: 1, fire: 3, dark: 2 } },
            { name: '百变怪', points: 0, gem: 'psychic', gemCount: 2, cost: { psychic: 1, psychic: 3, electric: 2 } },
            { name: '伊布', points: 0, gem: 'dark', gemCount: 2, cost: { psychic: 1, electric: 3, fire: 2 } }
        ]
    };
