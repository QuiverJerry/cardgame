/* ========================================
   网络通信模块
   ======================================== */

// WebSocket连接
let ws = null;

const Network = {
    /**
     * 连接到服务器
     */
    connect(url, onConnected, onMessage) {
        ws = new WebSocket(url);
        
        ws.onopen = () => {
            console.log('WebSocket 连接成功');
            if (onConnected) onConnected();
        };
        
        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (onMessage) onMessage(msg);
            } catch (error) {
                console.error('解析消息失败:', error);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
        };
        
        ws.onclose = () => {
            console.log('WebSocket 连接关闭');
        };
    },

    /**
     * 发送消息
     */
    send(data) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket 未连接');
        }
    },

    /**
     * 进入房间
     */
    enterRoom(room, id) {
        this.send({
            type: 'EnterRoom',
            room: room,
            id: id
        });
    },

    /**
     * 请求同步状态
     */
    syncRequest() {
        this.send({
            type: 'SyncRequest'
        });
    },

    /**
     * 更新状态
     */
    updateState(room, state) {
        this.send({
            type: 'UpdateState',
            room: room,
            state: state
        });
    },

    /**
     * 关闭连接
     */
    close() {
        if (ws) {
            ws.close();
            ws = null;
        }
    },

    /**
     * 获取连接状态
     */
    isConnected() {
        return ws && ws.readyState === WebSocket.OPEN;
    }
};