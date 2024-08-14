import { Button, _decorator } from "cc";
import { UIBase } from "../../common/ui/UIBase";
import { sv, vclick, vst } from "../../common/ui/decorators/SmartView";
import { EnumUIType, RegisterUI } from "../../common/ui/UIDefines";
import App from "../../common/App";
import UIGame from "../game/view/UIGame";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UIRoom", EnumUIType.Layer)
export default class UIRoom extends UIBase {

    @vclick("onBtnClickStart")
    @vst(Button)
    btn_start: Button = null;

    public onOpen(data?: any): void {
        this.addEvent();
    }

    public onClose(): void {
        this.removeEvent();
    }

    private addEvent() {
    }

    private removeEvent() {
    }

    private onBtnClickStart() {
        App.UI.open(UIGame)
    }

}