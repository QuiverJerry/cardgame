/* ========================================
   游戏核心逻辑
   ======================================== */

/** 按内容判断两张卡是否同一张（用于撤销时在可能被同步过的 state 中查找） */
function sameCard(a, b) {
    if (!a || !b) return false;
    if (a.name !== b.name || (a.gem || '') !== (b.gem || '')) return false;
    const costA = JSON.stringify(a.cost || {});
    const costB = JSON.stringify(b.cost || {});
    if (costA !== costB) return false;
    if ((a.evoTo || '') !== (b.evoTo || '') || (a.evoFrom || '') !== (b.evoFrom || '')) return false;
    return true;
}

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

        GameState.clearUndo();
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

        GameState.clearUndo();
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

        const state = GameState.get();
        const player = GameState.getMyPlayer();
        const playerId = GameState.getMyId();
        const level = location !== 'hand' ? location.split('_')[1] : null;

        if (mode === 'reserve') {
            // 预留卡牌
            if (player.reserved.length >= 3) {
                alert("预留已满（最多3张）");
                return;
            }
            this.removeCard(location, index);
            const lenBeforeRefill = level ? state.market[level].length : 0;
            player.reserved.push(card);
            this.autoRefill();
            const arr = state.market[level];
            const didDraw = level && arr && arr.length > lenBeforeRefill;
            const drawnCard = didDraw ? arr[arr.length - 1] : null;
            GameState.pushUndo({ action: 'reserve', playerId, card, marketLevel: level, marketIndex: index, drawnCard });
            this.broadcast(`${playerId} 预留了 ${card.name}`);
            
        } else if (mode === 'evolve') {
            // 进化卡牌
            const preCardIndex = player.caught.findIndex(c => c.name === card.evoFrom);
            if (preCardIndex === -1) {
                alert(`缺少前置卡牌: ${card.evoFrom}`);
                return;
            }
            const preCard = player.caught[preCardIndex];
            player.caught.splice(preCardIndex, 1);
            this.removeCard(location, index);
            const lenBeforeRefill = level ? state.market[level].length : 0;
            player.caught.push(card);
            this.autoRefill();
            const arr = state.market[level];
            const didDraw = level && arr && arr.length > lenBeforeRefill;
            const drawnCard = didDraw ? arr[arr.length - 1] : null;
            GameState.pushUndo({ action: 'evolve', playerId, evolvedCard: card, preCard, preCardIndex, marketLevel: level, marketIndex: index, drawnCard });
            this.broadcast(`${playerId} 进化了 ${card.name}`);
            
        } else {
            // 直接购买（含从保留区打出）
            if (location === 'hand') {
                this.removeCard(location, index);
                player.caught.push(card);
                GameState.pushUndo({ action: 'buyFromHand', playerId, card, reservedIndex: index });
                this.broadcast(`${playerId} 捕捉了 ${card.name}`);
            } else {
                this.removeCard(location, index);
                const lenBeforeRefill = state.market[level].length;
                player.caught.push(card);
                this.autoRefill();
                const arr = state.market[level];
                const didDraw = arr && arr.length > lenBeforeRefill;
                const drawnCard = didDraw ? arr[arr.length - 1] : null;
                GameState.pushUndo({ action: 'buy', playerId, card, marketLevel: level, marketIndex: index, drawnCard });
                this.broadcast(`${playerId} 捕捉了 ${card.name}`);
            }
        }

        this.broadcast();
    },

    /**
     * 撤回上一项操作（捕捉/进化/保留/从保留区捕捉）；涉及市场时会把补牌退回牌库
     */
    undo() {
        if (!GameState.isMyTurn()) {
            alert("非你的回合");
            return;
        }
        if (!GameState.canUndo()) {
            alert("没有可撤回的操作");
            return;
        }

        const state = GameState.get();
        const entry = GameState.popUndo();
        const playerId = entry.playerId;
        const player = state.players[playerId];
        if (!player) return;

        if (entry.action === 'reserve') {
            const { card, marketLevel, marketIndex, drawnCard } = entry;
            const arr = state.market[marketLevel];
            if (drawnCard != null && arr && arr.length > 0) {
                arr.pop();
                state.decks[marketLevel].push(drawnCard);
            }
            arr.splice(marketIndex, 0, card);
            const ri = player.reserved.findIndex(c => sameCard(c, card));
            if (ri !== -1) player.reserved.splice(ri, 1);
            this.broadcast(`${playerId} 撤回了预留`);
        } else if (entry.action === 'buy') {
            const { card, marketLevel, marketIndex, drawnCard } = entry;
            const arr = state.market[marketLevel];
            if (drawnCard != null && arr && arr.length > 0) {
                arr.pop();
                state.decks[marketLevel].push(drawnCard);
            }
            arr.splice(marketIndex, 0, card);
            const ci = player.caught.findIndex(c => sameCard(c, card));
            if (ci !== -1) player.caught.splice(ci, 1);
            this.broadcast(`${playerId} 撤回了捕捉`);
        } else if (entry.action === 'evolve') {
            const { evolvedCard, preCard, preCardIndex, marketLevel, marketIndex, drawnCard } = entry;
            const ei = player.caught.findIndex(c => sameCard(c, evolvedCard));
            if (ei !== -1) player.caught.splice(ei, 1);
            player.caught.splice(preCardIndex, 0, preCard);
            const arr = state.market[marketLevel];
            if (drawnCard != null && arr && arr.length > 0) {
                arr.pop();
                state.decks[marketLevel].push(drawnCard);
            }
            arr.splice(marketIndex, 0, evolvedCard);
            this.broadcast(`${playerId} 撤回了进化`);
        } else if (entry.action === 'buyFromHand') {
            const { card, reservedIndex } = entry;
            const ci = player.caught.findIndex(c => sameCard(c, card));
            if (ci !== -1) player.caught.splice(ci, 1);
            player.reserved.splice(reservedIndex, 0, card);
            this.broadcast(`${playerId} 撤回了从保留区捕捉`);
        }

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