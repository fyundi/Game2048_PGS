import { _decorator, Label } from "cc";
import { EnumUIType, RegisterUI } from "../ui/UIDefines";
import { UIBase } from "../ui/UIBase";
import { sv, vst } from "../ui/decorators/SmartView";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UISimulate", EnumUIType.Layer)
export default class UISimulate extends UIBase {
    @vst(Label)
    lblTip: Label = null;

    onLoad() {

    }
}