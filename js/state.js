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

// 撤销栈：仅当前回合内可撤销的操作（捕捉/进化/保留/从保留区捕捉）
let undoStack = [];

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
        undoStack = [];
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
        if (localState.logs.length > 50) {
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
    },

    /**
     * 压入撤销项（仅当前玩家、当前回合的操作）
     */
    pushUndo(entry) {
        undoStack.push(entry);
    },

    /**
     * 弹出撤销项
     */
    popUndo() {
        return undoStack.pop();
    },

    /**
     * 是否有可撤销操作
     */
    canUndo() {
        return undoStack.length > 0;
    },

    /**
     * 清空撤销栈（结束回合或重置时调用）
     */
    clearUndo() {
        undoStack = [];
    }
};