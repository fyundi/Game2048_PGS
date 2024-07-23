import Model from "./Model";

export class UserInfo extends Model {
    uid: number;      //web、wx下的用户id
    playerId: number; //通过GOBE返回
    name: string;
    icon: string;
}