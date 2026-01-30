import json
import asyncio
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PokemonServer")

# 房间存储：{ room_id: { clients: set(), game_state: { ... } } }
house = {}

async def application(scope, receive, send):
    if scope['type'] != 'websocket':
        return

    await send({'type': 'websocket.accept'})
    
    room_id = None
    user_id = None

    try:
        while True:
            event = await receive()
            
            if event['type'] == 'websocket.disconnect':
                break
            
            if event['type'] == 'websocket.receive':
                msg = json.loads(event['text'])
                m_type = msg.get('type')

                # --- 1. 进入房间 ---
                if m_type == 'EnterRoom':
                    room_id = str(msg.get('room', '101'))
                    user_id = str(msg.get('id', 'Unknown'))
                    
                    if room_id not in house:
                        house[room_id] = {'clients': set(), 'game_state': None}
                    
                    house[room_id]['clients'].add(send)
                    
                    # 如果游戏还没初始化，先建立基础玩家框架
                    if house[room_id]['game_state'] is None:
                        house[room_id]['game_state'] = {
                            'players': {},
                            'playerOrder': [],
                            'turnIndex': 0,
                            'logs': ["等待房主初始化..."]
                        }
                    
                    # 关键：将新玩家加入 players 字典和 playerOrder
                    if user_id not in house[room_id]['game_state']['players']:
                        house[room_id]['game_state']['players'][user_id] = {
                            'tokens': {'fire':0,'water':0,'electric':0,'psychic':0,'dark':0,'masterball':0},
                            'reserved': [],
                            'caught': []
                        }
                        # 只有在游戏还没正式开始（比如 reset 之前）自动添加顺序
                        if user_id not in house[room_id]['game_state']['playerOrder']:
                            house[room_id]['game_state']['playerOrder'].append(user_id)
                    
                    logger.info(f"训练家 {user_id} 加入房间 {room_id}")

                    # 立即给新加入的人同步一次完整状态
                    await send({
                        'type': 'websocket.send', 
                        'text': json.dumps({
                            'type': 'UpdateState',
                            'state': house[room_id]['game_state']
                        })
                    })

                # --- 2. 状态更新 ---
                elif m_type == 'UpdateState':
                    new_state = msg.get('state')
                    room = house.get(room_id)
                    
                    if room and new_state:
                        # 全量覆盖核心同步字段
                        room['game_state'].update({
                            'tokens': new_state.get('tokens'),
                            'market': new_state.get('market'),
                            'decks': new_state.get('decks'),
                            'logs': new_state.get('logs'),
                            'turnIndex': new_state.get('turnIndex', 0),
                            'playerOrder': new_state.get('playerOrder', [])
                        })
                        
                        # 合并玩家数据：更新当前发消息的玩家，保留其他玩家
                        updated_players = new_state.get('players', {})
                        room['game_state']['players'].update(updated_players)

                        # 广播
                        broadcast_data = json.dumps({
                            'type': 'UpdateState',
                            'state': room['game_state']
                        })
                        for client in list(room['clients']):
                            try:
                                await client({'type': 'websocket.send', 'text': broadcast_data})
                            except:
                                room['clients'].remove(client)

                # --- 3. 同步请求 ---
                elif m_type == 'SyncRequest':
                    room = house.get(room_id)
                    if room and room['game_state']:
                        await send({
                            'type': 'websocket.send',
                            'text': json.dumps({'type': 'UpdateState', 'state': room['game_state']})
                        })

    except Exception as e:
        logger.error(f"发生错误: {e}")
    finally:
        if room_id in house:
            house[room_id]['clients'].discard(send)
            if not house[room_id]['clients']:
                logger.info(f"房间 {room_id} 已空，清理内存")
                del house[room_id]


if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("server:application", host="0.0.0.0", port=port)