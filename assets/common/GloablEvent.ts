export default class GlobalEvent {
    public static START_COMPLETE: string = "START_COMPLETE";

    public static ON_USER_INITED: string = "ON_USER_INITED"; //用户信息初始化完成
    public static ON_PLAYER_ENTER_ROOM: string = "ON_PLAYER_ENTER_ROOM"; //进房成功
    public static UPDATE_ROOM_PLAYER: string = "UPDATE_ROOM_PLAYER"; //更新房间玩家信息

    public static ON_MATCH_SUCCESS: string = "ON_MATCH_SUCCESS"; //匹配成功
    public static ON_MATCH_CANCEL: string = "ON_MATCH_CANCEL"; //取消匹配
}