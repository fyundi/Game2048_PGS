import { Client, Group, Player, Room } from "../GOBE/GOBE";

export class GOBEConfig {
    public static appId: string = "172249065903323583";
    public static openId: string = "123";
    public static clientId: string = "1466025923722620352";
    public static clientSecret: string = "A1350519100D99FA7524EE87DEBA5CB4A670B5A02D826EF5697D3F2DD2F5B289";
    public static accessToken: string = "";
}

export enum EnumEnterRoomType {
    Create,
    Join,
    Match
}

// 设置全局变量global
export let GOBEGlobal = {
    client: null as Client | null, // Client实例
    room: null as Room | null,   // Room实例
    group: null as Group | null,  // Group实例
    gPlayer: null as Player | null, // Player实例
}
export let WGOBE = window.GOBE;