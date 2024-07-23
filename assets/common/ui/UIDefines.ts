import App from "../App";
import StringUtil from "../tools/StringUtil";
import { UIBase } from "./UIBase";

export enum EnumUIType {
    Layer = 1000,
    View = 2000,
    Tip = 3000,
    Alert = 4000,
}

export enum EnumUIOpenTween {
    None = 'None',
    NormalOpen = 'NormalOpen',
    ScaleBig = 'ScaleBig',
    FadeIn = 'FadeIn',
    PullUp = 'PullUp',
    DrawerBottomOpen = 'DrawerBottomOpen',
}

export enum EnumUICloseTween {
    None = 'None',
    NormalClose = 'NormalClose',
    ScaleSmall = 'ScaleSmall',
    FadeOut = 'FadeOut',
    PullDown = 'PullDown',
    DrawerBottomClose = 'DrawerBottomClose'
}

/** 具体UI类必须是该接口类型 */
export interface IOpeningUIInfo {
    uiClass: new () => UIBase;
    data: any
}

/** 具体UI类必须是该接口类型 */
export interface IUIConfig {
    prefabName: string;
    type: EnumUIType;
    uiClass: new () => UIBase;
}

// 装饰器，用于自动注册UI类
export function RegisterUI(prefabName: string, type: EnumUIType) {
    return function (target: new () => UIBase) {
        const className = StringUtil.getClassName(target);
        App.UI.registerUI(className, {
            prefabName: prefabName,
            type: type,
            uiClass: target
        } as IUIConfig);
    };
}
