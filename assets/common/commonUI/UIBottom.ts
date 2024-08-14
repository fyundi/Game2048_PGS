import { _decorator, Button, EditBox } from "cc";
import { EnumUIType, RegisterUI } from "../ui/UIDefines";
import { UIBase } from "../ui/UIBase";
import { sv, vclick, vst } from "../ui/decorators/SmartView";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UIBottom", EnumUIType.Layer)
export default class UIBottom extends UIBase {
    
}