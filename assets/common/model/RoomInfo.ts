import Model from "./Model";

export enum EnumRoomType {
    normal,
    vip
}

export class RoomInfo extends Model {
    rid: number; 
    maxPlayerCount: number = 4;
    roomName: string = "Happy Game";
    roomType: EnumRoomType = EnumRoomType.normal;
}