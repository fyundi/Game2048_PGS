import { _decorator, Label } from "cc";
import { EnumUIType, RegisterUI } from "../ui/UIDefines";
import { UIBase } from "../ui/UIBase";
import { sv, vst } from "../ui/decorators/SmartView";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UILoading", EnumUIType.Layer)
export default class UILoading extends UIBase {
    @vst(Label)
    lblTip: Label = null;

    onLoad() {
      
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}