import App from "../App";
import Log from "../log/Log";
import { EnumEnterRoomType, GOBEConfig, GOBEGlobal, WGOBE } from "./GOBEConfig";
import Singleton from "../singleton/Sington";
import { FramePlayerInfo, Room } from "../GOBE/GOBE";
import GlobalEvent from "../GloablEvent";

export class RoomManager extends Singleton<RoomManager> {

    public inited: boolean = false;

    public initGOBEClient(callBack?: Function) {
        GOBEConfig.openId = App.Model.self.uid.toString();
        if (GOBEGlobal.client != null) {
            GOBEGlobal.client.onMatch.clear();
            GOBEGlobal.client.destroy();
            this.inited = false;
        }
        GOBEGlobal.client = new WGOBE.Client({
            appId: GOBEConfig.appId,              // 应用ID，具体获取可参见准备游戏信息
            openId: GOBEConfig.openId,             // 玩家ID，区别不同用户
            clientId: GOBEConfig.clientId,           // 客户端ID，具体获取可参见准备游戏信息
            clientSecret: GOBEConfig.clientSecret, // 客户端密钥，具体获取可参见准备游戏信息
            accessToken: GOBEConfig.accessToken,  // AGC接入凭证(推荐)
            // platform: { platform },          // 平台类型（选填）
            // cerPath: '{cerPath}',          // 证书绝对路径（选填）
        })

        GOBEGlobal.client.onInitResult((resultCode) => {
            Log.print("onInitResult:", resultCode);
            if (resultCode === 0) {// 初始化成功，做相关游戏逻辑处理
                this.inited = true;
                this.addClientEvent();
                callBack?.(true);
            } else {
                // 初始化失败，重新初始化或联系华为技术支持
                callBack?.(false);
            }
        });

        GOBEGlobal.client.init().then((client) => {
            Log.print("init then:", client);
        }).catch((err) => {
            Log.print("init catch:", err);
            callBack?.(false);
        });
    }

    public async createRoom(roomConfig: any) {
        let playerConfig = {};
        GOBEGlobal.client.createRoom(roomConfig, playerConfig)
            .then((room) => {
                if (room) this.onEnterRoom(EnumEnterRoomType.Create, room);
            })
            .catch((err) => { Log.print("createRoom error: ", err) })
    }

    public async joinRoom(roomId: string, playerConfig?: any) {
        GOBEGlobal.client.joinRoom(roomId, playerConfig)
            .then((room) => {
                if (room) this.onEnterRoom(EnumEnterRoomType.Join, room);
            })
            .catch((err) => { Log.print("joinRoom error: ", err) })
    }

    /**在线匹配玩家 */
    public async matchPlayer() {
        let matchPlayerConfig = {
            playerInfo: {
                playerId: App.Model.self.playerId,
                matchParams: { level: 5 }
            },
            matchCode: "d9dac22bbefc4a13bd8016f77ef1f8de"
        };
        let playerConfig = null;
        return GOBEGlobal.client.matchPlayer(matchPlayerConfig, playerConfig)
            .then((matchResponse) => {
                return matchResponse && matchResponse.rtnCode == 0;
            })
            .catch((err) => {
                Log.print("matchPlayer error: ", err);
                return false;
            })
    }

    /**在线匹配房间 */
    public async matchRoom() {
        let matchRoomConfig = null;
        let playerConfig = null
        let room = await GOBEGlobal.client.matchRoom(matchRoomConfig, playerConfig);
        Log.print("matchRoom.matchRoom: ", room);
        return room;
    }

    /**在线匹配 */
    public async cancelMatch() {
        return GOBEGlobal.client.cancelMatch()
            .then((matchResponse) => {
                return matchResponse && matchResponse.rtnCode == 0;
            })
            .catch((err) => {
                Log.print("cancelMatch error: ", err);
                return false;
            })
    }

    private addClientEvent() {
        GOBEGlobal.client.onMatch((onMatchResponse) => this.onMatchResponseHandler(onMatchResponse));
    }

    /** 进房成功 */
    private onEnterRoom(type: EnumEnterRoomType, roomInfo: Room) {
        Log.print("onEnterRoom success: ", type, roomInfo);
        //设置全局信息
        GOBEGlobal.room = roomInfo;
        GOBEGlobal.gPlayer = roomInfo.player;
        //监听房间相关事件
        GOBEGlobal.room.onJoin((playerInfo) => { this.onPlayerJoinRoom(type, playerInfo); })
        GOBEGlobal.room.onJoinFailed((err) => { this.onJoinFailed(err); })
    }

    /** 收到匹配返回 */
    private onMatchResponseHandler(res) {
        Log.print("onMatchResponseHandler: ", res);
        if (res.rtnCode == 0) {
            this.onEnterRoom(EnumEnterRoomType.Match, res.room);
        } else {
            // 匹配失败
        }
    }

    /** 收到玩家进房 */
    private onPlayerJoinRoom(type: EnumEnterRoomType, playerInfo: FramePlayerInfo) {
        let playerEnterParam = {
            isSelf: false,
            enterType: type
        }
        if (playerInfo.playerId == GOBEGlobal.gPlayer.playerId) {
            playerEnterParam.isSelf = true;
        }
        App.Event.dispatch(GlobalEvent.ON_PLAYER_ENTER_ROOM, playerEnterParam);
    }

    /** 收到玩家进房 */
    private onJoinFailed(err) {
        Log.print("onJoinFailed: ", err);
    }

}
