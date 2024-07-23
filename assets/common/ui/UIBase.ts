import { Component } from "cc";
import { EnumUIOpenTween, EnumUIType, EnumUICloseTween } from "./UIDefines";

/**
 * UI界面基类
 */
export abstract class UIBase extends Component {
    /**
     * 是否缓存界面
     */
    public isCache: boolean = false;
    /**
     * 打开动画
     */
    public openTween: EnumUIOpenTween = EnumUIOpenTween.None;

    /**
     * 关闭动画
     */
    public closeTween: EnumUICloseTween = EnumUICloseTween.None;

    /**
     * 在UI打开时调用
     * @param data 传递给UI的数据
     */
    public onOpen(data?: any) {
        // 实现打开时的行为
    }

    /**
     * 在UI关闭时调用
     */
    public onClose() {
        // 实现关闭时的行为
    }
}