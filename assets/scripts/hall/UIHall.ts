import { Button, _decorator } from "cc";
import { UIBase } from "../../common/ui/UIBase";
import { sv, vclick, vst } from "../../common/ui/decorators/SmartView";
import App from "../../common/App";
import GlobalEvent from "../../common/GloablEvent";
import { EnumEnterRoomType } from "../../common/room/GOBEConfig";
import { EnumUIType, RegisterUI } from "../../common/ui/UIDefines";
import UIRoom from "../room/UIRoom";
import UIMatch from "../match/UIMatch";

const { ccclass, property } = _decorator;

@sv
@RegisterUI("UIHall", EnumUIType.Layer)
export default class UIHall extends UIBase {

    @vclick("onBtnClickCreate")
    @vst(Button)
    btn_create: Button = null;
    @vclick("onBtnClickMatch")
    @vst(Button)
    btn_match: Button = null;

    public onOpen(data?: any): void {
        this.addEvent();
    }

    public onClose(): void {
        this.removeEvent();
    }

    private addEvent() {
        App.Event.addEventListener(GlobalEvent.ON_PLAYER_ENTER_ROOM, this.onEnterRoomSuccess, this);
    }

    private removeEvent() {
        App.Event.removeEventListener(GlobalEvent.ON_PLAYER_ENTER_ROOM, this.onEnterRoomSuccess, this);
    }

    private onBtnClickCreate() {
        let roomConfig = {
            maxPlayers: 4,
            isPrivate: 0,
            roomName: App.Model.room.roomName,
            roomType: App.Model.room.roomType.toString(), // 房间类型，比如“高手区”、“菜鸟区”
        }
        App.Room.createRoom(roomConfig);
    }

    private async onBtnClickMatch() {
        let isReqMatchSuccess = await App.Room.matchPlayer();
        if (isReqMatchSuccess) {
            App.UI.open(UIMatch);
        }
    }

    private onEnterRoomSuccess(event: string, data: any) {
        let isSelf: boolean = data.isSelf;
        let type: EnumEnterRoomType = data.enterType;
        if (!isSelf) return;
        if (type == EnumEnterRoomType.Match) {
            App.Event.dispatch(GlobalEvent.ON_MATCH_SUCCESS);
        } else {
            App.UI.open(UIRoom);
        }
    }

}