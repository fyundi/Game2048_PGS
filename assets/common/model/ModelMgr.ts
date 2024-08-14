import Singleton from "../singleton/Sington";
import { RoomInfo } from "./RoomInfo";
import { UserInfo } from "./UserInfo";

export default class ModelManager extends Singleton<ModelManager> {
    public self: UserInfo = new UserInfo();
    public room: RoomInfo = new RoomInfo();

    initBaseInfo(data: any) {
        this.self.injection(data.user);
    }
}