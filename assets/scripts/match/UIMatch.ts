import { Button, _decorator } from "cc";
import { UIBase } from "../../common/ui/UIBase";
import { sv, vclick, vst } from "../../common/ui/decorators/SmartView";
import { EnumUIType, RegisterUI } from "../../common/ui/UIDefines";
import App from "../../common/App";
import GlobalEvent from "../../common/GloablEvent";
import UIGame from "../game/view/UIGame";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UIMatch", EnumUIType.View)
export default class UIMatch extends UIBase {

    @vclick("onBtnClickCancel")
    @vst(Button)
    btn_cancel: Button = null;

    public onOpen(data?: any): void {
        this.addEvent();
    }

    public onClose(): void {
        this.removeEvent();
    }

    private addEvent() {
        App.Event.addEventListener(GlobalEvent.ON_MATCH_SUCCESS, this.onMatchSuccess, this);
    }

    private removeEvent() {
        App.Event.removeEventListener(GlobalEvent.ON_MATCH_SUCCESS, this.onMatchSuccess, this);
    }

    private async onBtnClickCancel() {
        let isReqCancelSuccess = await App.Room.cancelMatch();
        if (isReqCancelSuccess) {
            App.UI.close(UIMatch);
        }
    }

    private async onMatchSuccess(event: string, data: any) {
        //关闭当前界面
        await App.UI.open(UIGame);
        App.UI.close(UIMatch);
    }

}