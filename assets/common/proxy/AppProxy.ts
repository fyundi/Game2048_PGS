import UIHall from "../../scripts/hall/UIHall";
import App from "../App";
import GlobalEvent from "../GloablEvent";
import Log from "../log/Log";
import { GOBEGlobal } from "../room/GOBEConfig";

/** 通用逻辑代理类 */
export class AppProxy {
    constructor() {
        this.init();
    }

    public init() {
        this.addEvent();
    }

    addEvent() {
        App.Event.addEventListener(GlobalEvent.ON_USER_INITED, this.onUserInited, this);
    }

    /** 用户初始化完成 */
    private onUserInited(event: string, data: any) {
        App.Room.initGOBEClient(async (isSuccess) => {
            Log.print("onUserInited-initGOBEClient:", isSuccess);
            if (isSuccess) {
                App.Model.self.playerId = GOBEGlobal.client.playerId;
                // await App.UI.open(UI);
                if (GOBEGlobal.client.room) { //请求重连
                    GOBEGlobal.room = GOBEGlobal.client.room;
                } else {
                    //打开大厅界面
                    await App.UI.open(UIHall);
                }
            }

        });
    }


}
