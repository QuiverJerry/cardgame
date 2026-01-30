/* ========================================
   游戏核心逻辑
   ======================================== */

const Game = {
    /**
     * 重置游戏桌面
     */
    resetTable() {
        const state = GameState.get();
        const playersIds = Object.keys(state.players);
        
        if (playersIds.length < 1) {
            alert("无玩家");
            return;
        }

        // 复制并洗牌
        const decks = JSON.parse(JSON.stringify(RAW_CARDS_DATA));
        for (let key in decks) {
            decks[key].sort(() => Math.random() - 0.5);
        }

        // 根据玩家数量设置代币数
        const countPerColor = TOKEN_COUNT_BY_PLAYERS[playersIds.length] || 7;
        
        state.tokens = {
            fire: countPerColor,
            water: countPerColor,
            electric: countPerColor,
            psychic: countPerColor,
            dark: countPerColor,
            masterball: 5
        };

        state.decks = decks;
        state.market = { lvl1: [], lvl2: [], lvl3: [], legends: [], rares: [] };
        state.playerOrder = playersIds;
        state.turnIndex = 0;
        state.logs = ["系统: 游戏开始！"];

        // 初始化每个玩家
        playersIds.forEach(id => {
            state.players[id] = {
                tokens: { fire: 0, water: 0, electric: 0, psychic: 0, dark: 0, masterball: 0 },
                reserved: [],
                caught: []
            };
        });

        this.autoRefill();
        this.broadcast("游戏已重置");
    },

    /**
     * 结束回合
     */
    endTurn() {
        if (!GameState.isMyTurn()) {
            alert("非你的回合");
            return;
        }

        GameState.nextTurn();
        this.broadcast(`${GameState.getMyId()} 结束回合`);
    },

    /**
     * 自动补充市场卡牌
     */
    autoRefill() {
        const state = GameState.get();
        
        for (let key in MARKET_SLOTS) {
            const targetCount = MARKET_SLOTS[key];
            while (
                state.market[key].length < targetCount && 
                state.decks[key] && 
                state.decks[key].length > 0
            ) {
                state.market[key].push(state.decks[key].pop());
            }
        }
    },

    /**
     * 购买/预留/进化卡牌
     */
    buyCard(location, index, card, mode) {
        if (!GameState.isMyTurn()) {
            alert("非你的回合");
            return;
        }

        const player = GameState.getMyPlayer();
        const playerId = GameState.getMyId();

        if (mode === 'reserve') {
            // 预留卡牌
            if (player.reserved.length >= 3) {
                alert("预留已满（最多3张）");
                return;
            }
            this.removeCard(location, index);
            player.reserved.push(card);
            this.broadcast(`${playerId} 预留了 ${card.name}`);
            
        } else if (mode === 'evolve') {
            // 进化卡牌
            const preCardIndex = player.caught.findIndex(c => c.name === card.evoFrom);
            if (preCardIndex === -1) {
                alert(`缺少前置卡牌: ${card.evoFrom}`);
                return;
            }
            player.caught.splice(preCardIndex, 1); // 移除前置
            this.removeCard(location, index);
            player.caught.push(card);
            this.broadcast(`${playerId} 进化了 ${card.name}`);
            
        } else {
            // 直接购买
            this.removeCard(location, index);
            player.caught.push(card);
            this.broadcast(`${playerId} 捕捉了 ${card.name}`);
        }

        this.autoRefill();
        this.broadcast();
    },

    /**
     * 从位置移除卡牌
     */
    removeCard(location, index) {
        const state = GameState.get();
        const player = GameState.getMyPlayer();

        if (location === 'hand') {
            player.reserved.splice(index, 1);
        } else {
            const level = location.split('_')[1];
            state.market[level].splice(index, 1);
        }
    },

    /**
     * 拾取代币
     */
    takeToken(tokenType) {
        if (!GameState.isMyTurn()) {
            alert("非你的回合");
            return;
        }

        const state = GameState.get();
        const player = GameState.getMyPlayer();

        if (state.tokens[tokenType] > 0) {
            state.tokens[tokenType]--;
            player.tokens[tokenType]++;
            this.broadcast(`${GameState.getMyId()} 拿取了 ${ICONS[tokenType]}`);
        }
    },

    /**
     * 归还代币
     */
    returnToken(tokenType) {
        if (!GameState.isMyTurn()) {
            alert("非你的回合");
            return;
        }

        const state = GameState.get();
        const player = GameState.getMyPlayer();

        if (player.tokens[tokenType] > 0) {
            player.tokens[tokenType]--;
            state.tokens[tokenType]++;
            this.broadcast(`${GameState.getMyId()} 归还了 ${ICONS[tokenType]}`);
        }
    },

    /**
     * 广播状态更新
     */
    broadcast(log) {
        if (log) {
            GameState.addLog(log);
        }
        Network.updateState(GameState.getRoomId(), GameState.get());
        UI.render();
    },

    /**
     * 计算玩家分数
     */
    calculateScore(player) {
        return player.caught.reduce((sum, card) => sum + (card.points || 0), 0);
    },

    /**
     * 计算玩家永久能力点（收藏图鉴中每张卡的 gem 按 gemCount 累加，无 gemCount 视为 1）
     * 返回 { fire, water, electric, psychic, dark }
     */
    calculateAbilityPoints(player) {
        const ap = { fire: 0, water: 0, electric: 0, psychic: 0, dark: 0 };
        (player.caught || []).forEach(card => {
            const gem = card.gem;
            if (gem && ap.hasOwnProperty(gem)) {
                ap[gem] += card.gemCount ?? 1;
            }
        });
        return ap;
    }
};