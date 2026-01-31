/* ========================================
   主程序入口
   ======================================== */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

/**
 * 初始化游戏
 */
function initializeGame() {
    bindEvents();
    GameState.init();
}

/**
 * 绑定所有事件
 */
function bindEvents() {
    // 登录按钮
    document.getElementById('joinGameBtn').addEventListener('click', joinGame);

    // 结束回合按钮
    document.getElementById('endTurnBtn').addEventListener('click', () => {
        Game.endTurn();
    });

    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('确定要重置游戏吗？')) {
            Game.resetTable();
        }
    });

    // 关闭放大预览
    document.getElementById('zoomOverlay').addEventListener('click', function() {
        this.style.display = 'none';
    });

    // 模态框取消按钮
    document.querySelector('#actionModal .cancel-btn').addEventListener('click', () => {
        UI.closeModal('actionModal');
    });

    // 模态框关闭按钮
    document.querySelector('#detailModal .close-btn').addEventListener('click', () => {
        UI.closeModal('detailModal');
    });

    // 日志按钮：点击展开/收起日志面板
    document.getElementById('logBtn').addEventListener('click', () => {
        const panel = document.getElementById('gameLog');
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            panel.scrollTop = panel.scrollHeight;
        }
    });

}

/**
 * 加入游戏
 */
function joinGame() {
    const serverUrl = document.getElementById('serverUrl').value;
    const roomIdInput = document.getElementById('roomId').value;
    const userIdInput = document.getElementById('userId').value;

    if (!serverUrl || !roomIdInput || !userIdInput) {
        alert('请填写完整信息');
        return;
    }

    GameState.setMyId(userIdInput);
    GameState.setRoomId(roomIdInput);

    // 连接服务器
    Network.connect(
        serverUrl,
        // 连接成功回调
        () => {
            UI.showGameScreen();
            Network.enterRoom(roomIdInput, userIdInput);
            // 延迟请求同步
            setTimeout(() => {
                Network.syncRequest();
            }, 300);
        },
        // 消息接收回调
        (msg) => {
            handleServerMessage(msg);
        }
    );
}

/**
 * 处理服务器消息
 */
function handleServerMessage(msg) {
    console.log('收到服务器消息:', msg);

    switch (msg.type) {
        case 'UpdateState':
        case 'InitializeRoomState':
            if (msg.state) {
                GameState.update(msg.state);
                UI.render();
            }
            break;

        case 'Error':
            console.error('服务器错误:', msg.message);
            alert(`错误: ${msg.message}`);
            break;

        default:
            console.log('未处理的消息类型:', msg.type);
    }
}

/**
 * 页面卸载时清理
 */
window.addEventListener('beforeunload', () => {
    Network.close();
});