/* ========================================
   UI渲染和交互
   ======================================== */

// 长按计时器
let longPressTimer = null;

const UI = {
    /**
     * 渲染整个界面
     */
    render() {
        this.renderTopBar();
        this.renderMarket();
        this.renderBankTokens();
        this.renderOpponents();
        this.renderPlayerDashboard();
    },

    /**
     * 渲染顶部栏
     */
    renderTopBar() {
        const currentPlayer = GameState.getCurrentPlayer();
        const isMyTurn = GameState.isMyTurn();
        const myPlayer = GameState.getMyPlayer();

        const indicator = document.getElementById('turnIndicator');
        const endBtn = document.getElementById('endTurnBtn');

        indicator.textContent = isMyTurn ? "🟢 你的回合" : `🟡 ${currentPlayer}`;
        indicator.style.color = isMyTurn ? "#00ff00" : "#ffcb05";
        endBtn.style.background = isMyTurn ? "#4caf50" : "#444";

        document.getElementById('roomDisplay').textContent =
            `${GameState.getMyId()} | 房间:${GameState.getRoomId()}`;

        const scoreEl = document.getElementById('myScoreDisplay');
        if (scoreEl && myPlayer) {
            scoreEl.textContent = '🏆 ' + Game.calculateScore(myPlayer);
        }
    },

    /**
     * 渲染传说/稀有槽位（同一行左右两侧，由 HTML 已排好）
     */
    renderLegendRareSlots() {
        const state = GameState.get();
        const legendSlot = document.getElementById('legendCardSlot');
        const rareSlot = document.getElementById('rareCardSlot');
        if (!legendSlot || !rareSlot) return;
        legendSlot.innerHTML = '';
        rareSlot.innerHTML = '';

        const legendCard = (state.market.legends || [])[0];
        const rareCard = (state.market.rares || [])[0];
        if (legendCard) {
            const el = this.createCard(legendCard, () => this.showActionModal('market_legends', 0, legendCard));
            legendSlot.appendChild(el);
        }
        if (rareCard) {
            const el = this.createCard(rareCard, () => this.showActionModal('market_rares', 0, rareCard));
            rareSlot.appendChild(el);
        }
    },

    /**
     * 渲染市场区域（仅最终/二阶/一阶；传说、稀有在 legend-rare-row 中）
     */
    renderMarket() {
        const state = GameState.get();
        this.renderLegendRareSlots();

        const marketArea = document.getElementById('marketArea');
        marketArea.innerHTML = '';

        const rowLevels = ['lvl3', 'lvl2', 'lvl1'];
        rowLevels.forEach(level => {
            const row = document.createElement('div');
            row.className = 'card-row';

            const cards = state.market[level] || [];
            cards.forEach((card, index) => {
                const cardElement = this.createCard(card, () => {
                    this.showActionModal(`market_${level}`, index, card);
                });
                row.appendChild(cardElement);
            });

            marketArea.appendChild(row);
        });
    },

    /**
     * 渲染银行代币
     */
    renderBankTokens() {
        const state = GameState.get();
        const bank = document.getElementById('bankTokens');
        bank.innerHTML = '';

        TOKEN_TYPES.forEach(tokenType => {
            const token = document.createElement('div');
            token.className = `token bg-${tokenType}`;
            token.textContent = state.tokens[tokenType] || 0;
            token.onclick = () => Game.takeToken(tokenType);
            bank.appendChild(token);
        });
    },

    /**
     * 渲染对手列表（点开前仅显示：名字、分数；已扣资源用小圈展示，仅显示有的）
     */
    renderOpponents() {
        const state = GameState.get();
        const oppDiv = document.getElementById('opponentsList');
        oppDiv.innerHTML = '';

        const GEM_IDS = ['fire', 'water', 'electric', 'psychic', 'dark'];

        Object.entries(state.players).forEach(([pid, pData]) => {
            if (pid === GameState.getMyId()) return;

            const score = Game.calculateScore(pData);
            const tokens = pData.tokens || {};

            const line1 = document.createElement('div');
            line1.className = 'opp-line opp-line-name-score';
            line1.textContent = `${pid} 🏆${score}`;

            const line2 = document.createElement('div');
            line2.className = 'opp-tokens-row';
            TOKEN_TYPES.forEach(tokenType => {
                const count = tokens[tokenType] || 0;
                if (count > 0) {
                    const circle = document.createElement('div');
                    circle.className = `token bg-${tokenType}`;
                    circle.textContent = count;
                    line2.appendChild(circle);
                }
            });

            const item = document.createElement('div');
            item.className = 'opp-item';
            item.onclick = () => this.showOpponentDetail(pid);
            item.appendChild(line1);
            item.appendChild(line2);
            oppDiv.appendChild(item);
        });
    },

    /**
     * 渲染玩家面板
     */
    renderPlayerDashboard() {
        const player = GameState.getMyPlayer();
        if (!player) return;

        // 分数统计
        const score = Game.calculateScore(player);
        const scoreStatEl = document.getElementById('myScoreStat');
        if (scoreStatEl) scoreStatEl.textContent = '分数: ' + score;

        // 永久能力点统计（收藏图鉴中卡牌 gem 按 gemCount 累加）
        const ap = Game.calculateAbilityPoints(player);
        const GEM_IDS = ['fire', 'water', 'electric', 'psychic', 'dark'];
        GEM_IDS.forEach(gem => {
            const el = document.getElementById('myAbilityStat' + gem.charAt(0).toUpperCase() + gem.slice(1));
            if (el) el.textContent = (ICONS[gem] || '') + ap[gem];
        });

        // 渲染玩家代币
        const tokenContainer = document.getElementById('myTokensContainer');
        tokenContainer.innerHTML = '';
        
        Object.entries(player.tokens).forEach(([tokenType, count]) => {
            if (count > 0) {
                const token = document.createElement('div');
                token.className = `token bg-${tokenType}`;
                token.style.width = '28px';
                token.style.height = '28px';
                token.textContent = count;
                token.onclick = () => Game.returnToken(tokenType);
                tokenContainer.appendChild(token);
            }
        });

        // 渲染保留区：按颜色排序显示，点击时仍用原始索引
        const handContainer = document.getElementById('myHandContainer');
        handContainer.innerHTML = '';
        const GEM_ORDER = ['fire', 'water', 'electric', 'psychic', 'dark'];
        const withIndex = player.reserved.map((card, index) => ({ card, index }));
        withIndex.sort((a, b) => GEM_ORDER.indexOf(a.card.gem) - GEM_ORDER.indexOf(b.card.gem));
        withIndex.forEach(({ card, index: originalIndex }) => {
            const cardElement = this.createCard(card, () => {
                this.showActionModal('hand', originalIndex, card);
            });
            handContainer.appendChild(cardElement);
        });

        // 渲染收藏图鉴：按颜色排序显示
        const tableauContainer = document.getElementById('myTableauContainer');
        tableauContainer.innerHTML = '';
        const sortedCaught = [...player.caught].sort((a, b) => GEM_ORDER.indexOf(a.gem) - GEM_ORDER.indexOf(b.gem));
        sortedCaught.forEach(card => {
            const cardElement = this.createCard(card);
            tableauContainer.appendChild(cardElement);
        });
    },

    /**
     * 渲染游戏日志
     */
    renderGameLog() {
        const state = GameState.get();
        const logDiv = document.getElementById('gameLog');
        if (!logDiv) return;
        logDiv.innerHTML = (state.logs || []).map(log => `<div>${log}</div>`).join('');
        if (logDiv.classList.contains('open')) {
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    },

    /**
     * 创建卡牌元素
     */
    createCard(card, onClick = null, isZoom = false) {
        const el = document.createElement('div');
        const typeClass = card.gem;
        el.className = `card ${typeClass}`;

        if (onClick) {
            el.onclick = onClick;
        }

        // 添加长按放大功能（触摸 + 鼠标）
        if (!isZoom) {
            el.addEventListener('touchstart', () => this.handleCardTouchStart(card));
            el.addEventListener('touchend', () => this.handleCardTouchEnd());
            el.addEventListener('touchmove', () => this.handleCardTouchEnd());
            el.addEventListener('mousedown', (e) => { e.preventDefault(); this.handleCardTouchStart(card); });
            el.addEventListener('mouseup', () => this.handleCardTouchEnd());
            el.addEventListener('mouseleave', () => this.handleCardTouchEnd());
        }

        const icon = ICONS[card.gem] || '';
        const topIconHtml = card.gemCount === 2 ? 
            `<span>${icon}${icon}</span>` : 
            `<span>${icon}</span>`;

        // 分数部分（无分数也保留上方位置，保证折叠后布局一致）
        const pointsHtml = `<div class="card-points">${card.points > 0 ? card.points : ''}</div>`;

        // 能力点（叠放时显示，两个时垂直叠放）
        const abilityHtml = card.gemCount === 2
            ? `<div class="sidebar-ability"><span class="ability-icon">${icon}</span><span class="ability-icon">${icon}</span></div>`
            : `<div class="sidebar-ability"><span class="ability-icon">${icon}</span></div>`;

        // 价格部分（叠放时隐藏）
        const costHtml = Object.entries(card.cost)
            .map(([color, num]) => `<div class="cost-bubble bg-${color}">${num}</div>`)
            .join('');

        // 进化对象+条件（叠放时显示：进化目标 → 大号条件圆圈）
        let evoMiniHtml = '';
        if (card.evoTo) {
            const num = card.evoFee.match(/\d+/);
            const colorText = card.evoFee.replace(/需\d+/, '');
            const colorName = COLOR_MAP[colorText] || 'dark';
            const n = num ? num[0] : '';
            evoMiniHtml = `
                <div class="evo-mini">
                    <div class="evo-mini-target" title="${card.evoTo} 需${n}${colorText}">${card.evoTo}</div>
                    <div class="evo-cost-badge evo-cost-badge-mini bg-${colorName}">${n}</div>
                </div>
            `;
        }

        const costSidebarHtml = `
            <div class="card-cost-sidebar">
                ${pointsHtml}
                ${abilityHtml}
                ${evoMiniHtml}
                <div class="card-cost-list">
                    ${costHtml}
                </div>
            </div>
        `;

        // 进化信息
        let evoHtml = "";
        if (card.evoTo) {
            const num = card.evoFee.match(/\d+/)[0];
            const colorText = card.evoFee.replace(/需\d+/, '');
            const colorName = COLOR_MAP[colorText] || 'dark';
            evoHtml = `
                <div class="evo-container">
                    <div class="evo-target">${card.evoTo}</div>
                    <div class="evo-cost-badge bg-${colorName}">${num}</div>
                </div>
            `;
        }

        el.innerHTML = `
            ${costSidebarHtml}
            <div class="card-main">
                <div class="card-header">
                    ${topIconHtml}
                </div>
                <div class="card-img">
                    <div class="card-name" style="${isZoom ? 'font-size:20px' : ''}">${card.name}</div>
                    ${evoHtml}
                </div>
            </div>
        `;

        return el;
    },

    /**
     * 处理卡牌长按开始
     */
    handleCardTouchStart(card) {
        longPressTimer = setTimeout(() => {
            this.showCardZoom(card);
        }, LONG_PRESS_DELAY);
    },

    /**
     * 显示长按卡牌详情弹窗：卡图 + 结构化信息 + 关闭
     */
    showCardZoom(card) {
        const overlay = document.getElementById('zoomOverlay');
        overlay.innerHTML = '';

        const panel = document.createElement('div');
        panel.className = 'zoom-panel';
        panel.addEventListener('click', (e) => e.stopPropagation());

        const cardWrap = document.createElement('div');
        cardWrap.className = 'zoom-card-wrap';
        cardWrap.appendChild(this.createCard(card, null, true));
        panel.appendChild(cardWrap);

        const icon = ICONS[card.gem] || '';
        const gemCount = card.gemCount || 1;
        const costParts = Object.entries(card.cost || {})
            .map(([color, num]) => `${ICONS[color] || ''}×${num}`)
            .join(' ');
        let evoText = '';
        if (card.evoFrom) evoText += `进化自：${card.evoFrom}`;
        if (card.evoTo) {
            if (evoText) evoText += '；';
            evoText += `进化至：${card.evoTo}（${card.evoFee || ''}）`;
        }
        if (!evoText) evoText = '—';

        const info = document.createElement('div');
        info.className = 'zoom-info';
        info.innerHTML = `
            <div class="zoom-info-row zoom-info-name">${card.name}</div>
            <div class="zoom-info-row">
                <span class="zoom-label">分数</span>
                <span class="zoom-value">${card.points != null ? card.points : 0}</span>
            </div>
            <div class="zoom-info-row">
                <span class="zoom-label">属性</span>
                <span class="zoom-value">${icon}×${gemCount}</span>
            </div>
            <div class="zoom-info-row">
                <span class="zoom-label">所需资源</span>
                <span class="zoom-value zoom-cost">${costParts || '—'}</span>
            </div>
            <div class="zoom-info-row zoom-info-evo">
                <span class="zoom-label">进化</span>
                <span class="zoom-value">${evoText}</span>
            </div>
        `;
        panel.appendChild(info);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'zoom-close-btn';
        closeBtn.textContent = '关闭';
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        panel.appendChild(closeBtn);

        const hint = document.createElement('div');
        hint.className = 'zoom-close-hint';
        hint.textContent = '点击空白处关闭';
        panel.appendChild(hint);

        overlay.appendChild(panel);
        overlay.style.display = 'flex';
    },

    /**
     * 处理卡牌长按结束
     */
    handleCardTouchEnd() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    },

    /**
     * 显示操作模态框
     */
    showActionModal(location, index, card) {
        if (!GameState.isMyTurn()) {
            alert("不是你的回合");
            return;
        }

        const modal = document.getElementById('actionModal');
        const buttonsContainer = document.getElementById('modalButtons');
        
        document.getElementById('modalCardName').textContent = card.name;
        buttonsContainer.innerHTML = '';

        const addButton = (text, color, handler) => {
            const btn = document.createElement('button');
            btn.className = 'modal-btn';
            btn.style.background = color;
            btn.textContent = text;
            btn.onclick = () => {
                handler();
                this.closeModal('actionModal');
            };
            buttonsContainer.appendChild(btn);
        };

        if (location !== 'hand') {
            addButton('直接捕捉', '#4caf50', () => 
                Game.buyCard(location, index, card, 'buy'));
            // 传说、稀有牌不可预留，只可捕捉
            if (location !== 'market_legends' && location !== 'market_rares') {
                addButton('预留卡牌', '#ff9800', () => 
                    Game.buyCard(location, index, card, 'reserve'));
            }
            if (card.evoFrom) {
                addButton('进化捕捉', '#2196f3', () => 
                    Game.buyCard(location, index, card, 'evolve'));
            }
        } else {
            addButton('从保留区打出', '#4caf50', () => 
                Game.buyCard(location, index, card, 'buy'));
        }

        modal.style.display = 'flex';
    },

    /**
     * 显示对手详情（优化格式：分数、永久能力、已扣资源、保留区、收藏图鉴）
     */
    showOpponentDetail(playerId) {
        const state = GameState.get();
        const player = state.players[playerId];
        if (!player) return;

        document.getElementById('detailPlayerName').textContent = playerId;

        const detailContent = document.getElementById('detailContent');
        const score = Game.calculateScore(player);
        const ap = Game.calculateAbilityPoints(player);
        const tokens = player.tokens || {};
        const GEM_IDS = ['fire', 'water', 'electric', 'psychic', 'dark'];

        const apStr = GEM_IDS.map(g => `${ICONS[g] || ''}${ap[g] || 0}`).join(' ');
        const tokenParts = [];
        TOKEN_TYPES.forEach(t => {
            const n = tokens[t] || 0;
            if (n > 0) tokenParts.push(`${ICONS[t] || ''}${n}`);
        });
        const tokenStr = tokenParts.length ? tokenParts.join(' ') : '—';

        detailContent.innerHTML = `
            <div class="detail-stats">
                <div class="detail-stat-row">
                    <span class="detail-label">分数</span>
                    <span class="detail-value detail-score">🏆 ${score}</span>
                </div>
                <div class="detail-stat-row">
                    <span class="detail-label">永久能力</span>
                    <span class="detail-value">${apStr}</span>
                </div>
                <div class="detail-stat-row">
                    <span class="detail-label">已扣资源</span>
                    <span class="detail-value">${tokenStr}</span>
                </div>
            </div>
            <div class="detail-sections"></div>
        `;

        const sectionsEl = detailContent.querySelector('.detail-sections');

        if (player.reserved && player.reserved.length > 0) {
            const reservedSection = document.createElement('div');
            reservedSection.className = 'detail-section';
            reservedSection.innerHTML = '<div class="detail-section-title">📦 保留区</div>';
            const reservedCards = document.createElement('div');
            reservedCards.className = 'detail-cards';
            player.reserved.forEach(card => {
                reservedCards.appendChild(this.createCard(card));
            });
            reservedSection.appendChild(reservedCards);
            sectionsEl.appendChild(reservedSection);
        }

        if (player.caught && player.caught.length > 0) {
            const caughtSection = document.createElement('div');
            caughtSection.className = 'detail-section';
            caughtSection.innerHTML = '<div class="detail-section-title">🏆 收藏图鉴</div>';
            const caughtCards = document.createElement('div');
            caughtCards.className = 'detail-cards';
            player.caught.forEach(card => {
                caughtCards.appendChild(this.createCard(card));
            });
            caughtSection.appendChild(caughtCards);
            sectionsEl.appendChild(caughtSection);
        }

        if (!sectionsEl.hasChildNodes() || sectionsEl.children.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'detail-empty';
            empty.textContent = '暂无保留卡牌与收藏';
            sectionsEl.appendChild(empty);
        }

        document.getElementById('detailModal').style.display = 'flex';
    },

    /**
     * 关闭模态框
     */
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    /**
     * 显示登录界面
     */
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('gameScreen').style.display = 'none';
    },

    /**
     * 显示游戏界面
     */
    showGameScreen() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'flex';
    }
};