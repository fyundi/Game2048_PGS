import App from "../App";
import GlobalEvent from "../GloablEvent";
import GlobalConfig from "../GlobalConfig";
import Log from "../log/Log";
import { GOBEConfig, GOBEGlobal, WGOBE } from "./GOBEConfig";
import Singleton from "../singleton/Sington";

export class RoomManager extends Singleton<RoomManager> {

    private createGOBEClient() {
        GOBEGlobal.client = new WGOBE.Client({
            appId: GOBEConfig.appId,              // 应用ID，具体获取可参见准备游戏信息
            openId: GOBEConfig.openId,             // 玩家ID，区别不同用户
            clientId: GOBEConfig.clientId,           // 客户端ID，具体获取可参见准备游戏信息
            clientSecret: GOBEConfig.clientSecret, // 客户端密钥，具体获取可参见准备游戏信息
            accessToken: GOBEConfig.accessToken,  // AGC接入凭证(推荐)
            // platform: { platform },          // 平台类型（选填）
            // cerPath: '{cerPath}',          // 证书绝对路径（选填）
        })
        GOBEGlobal.client.onInitResult = () => { this.onClientInitResult };
    }

    private addEvent() {
        App.Event.addEventListener(GlobalEvent.START_COMPLETE, this.onStartComplete, this);
    }

    private onStartComplete(event: string, data: any): void {
        this.initClient();
    }

    private initClient() {
        let gobePlayerId: number;
        GOBEGlobal.client.init().then((client) => {
            Log.print("init then:", client);
            // 已完成初始化请求，具体初始化结果通过onInitResult回调获取
            gobePlayerId = client.playerId;
        }).catch((err) => {
            Log.print("init catch:", err);
            // 初始化请求失败，重新初始化或联系华为技术支持
        });
    }

    private onClientInitResult(resultCode) {
        Log.print("onInitResult:", resultCode);
        if (resultCode === 0) {
            // 初始化成功，做相关游戏逻辑处理
        } else {
            // 初始化失败，重新初始化或联系华为技术支持
        }
    }
}