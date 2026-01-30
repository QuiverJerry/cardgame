/* ========================================
   游戏状态管理
   ======================================== */

// 全局游戏状态
let localState = {
    tokens: {},
    market: {
        lvl1: [],
        lvl2: [],
        lvl3: [],
        legends: [],
        rares: []
    },
    decks: {},
    players: {},
    logs: [],
    turnIndex: 0,
    playerOrder: []
};

// 当前玩家ID
let myId = '';

// 房间ID
let roomId = '';

// 状态操作函数
const GameState = {
    /**
     * 初始化状态
     */
    init() {
        localState = {
            tokens: {},
            market: { lvl1: [], lvl2: [], lvl3: [], legends: [], rares: [] },
            decks: {},
            players: {},
            logs: [],
            turnIndex: 0,
            playerOrder: []
        };
    },

    /**
     * 更新状态
     */
    update(newState) {
        if (newState) {
            localState = newState;
        }
    },

    /**
     * 获取当前状态
     */
    get() {
        return localState;
    },

    /**
     * 获取当前玩家数据
     */
    getMyPlayer() {
        return localState.players[myId];
    },

    /**
     * 判断是否是当前玩家的回合
     */
    isMyTurn() {
        return localState.playerOrder[localState.turnIndex] === myId;
    },

    /**
     * 获取当前回合玩家
     */
    getCurrentPlayer() {
        return localState.playerOrder[localState.turnIndex] || "等待中";
    },

    /**
     * 添加日志
     */
    addLog(log) {
        localState.logs.push(log);
        if (localState.logs.length > 3) {
            localState.logs.shift();
        }
    },

    /**
     * 下一回合
     */
    nextTurn() {
        localState.turnIndex = (localState.turnIndex + 1) % localState.playerOrder.length;
    },

    /**
     * 设置玩家ID
     */
    setMyId(id) {
        myId = id;
    },

    /**
     * 获取玩家ID
     */
    getMyId() {
        return myId;
    },

    /**
     * 设置房间ID
     */
    setRoomId(id) {
        roomId = id;
    },

    /**
     * 获取房间ID
     */
    getRoomId() {
        return roomId;
    }
};