export interface ICommonRes {
    success: boolean,
    msg?: string,
    data?: any
}

export enum EnumPlatform {
    Web = "web",
    Wx = "wx"
}

/**
 * wx小游戏平台Api入口
 */
export let wx = (window as any).wx;