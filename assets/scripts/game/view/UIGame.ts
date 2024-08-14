import { _decorator } from "cc";
import { UIBase } from "../../../common/ui/UIBase";
import { sv } from "../../../common/ui/decorators/SmartView";
import { EnumUIType, RegisterUI } from "../../../common/ui/UIDefines";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UIGame", EnumUIType.Layer)
export default class UIGame extends UIBase {
   

}