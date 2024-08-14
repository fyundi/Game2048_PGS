import { _decorator, Button, EditBox } from "cc";
import { EnumUIType, RegisterUI } from "../ui/UIDefines";
import { UIBase } from "../ui/UIBase";
import { sv, vclick, vst } from "../ui/decorators/SmartView";
import App from "../App";
import GlobalEvent from "../GloablEvent";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UISimulate", EnumUIType.Layer)
export default class UISimulate extends UIBase {
    @vst(EditBox)
    edit_userId: EditBox = null;

    @vclick("onChangeUid")
    @vst(Button)
    btn_change_uid: Button = null;
    @vclick("onJoinGame")
    @vst(Button)
    btn_join_game: Button = null;

    private _uid: number;
    private static temp_uid: number = 1001;

    onLoad() {
        this.uid = parseInt(localStorage.getItem("pgs_uid")) || UISimulate.temp_uid;
        this.edit_userId.node.on('text-changed', this.onEditUserIdTextChanged, this);
    }

    onChangeUid() {
        this.uid = this.uid + 1;
    }

    onJoinGame() {
        App.Event.dispatch(GlobalEvent.ON_USER_INITED);
    }

    set uid(value: number) {
        if (this._uid != value) {
            this._uid = value;
            App.Model.self.uid = value;
            App.Model.self.name = "测试玩家" + value;
            localStorage.setItem("pgs_uid", value + "");
            this.edit_userId.string = this._uid?.toString();
        }
    }


    get uid(): number { return this._uid }

    onEditUserIdTextChanged(editbox) {
        this.uid = editbox.string;
    }
}