import App from "../App";
import { ICommonRes } from "../CommonDefine";
import GlobalEvent from "../GloablEvent";
import UILoading from "../commonUI/UILoading";
import { IPlatform } from "./IPlatform";

export default class Platform implements IPlatform {
    constructor() {
    }

    getBundles(): string[] {
        return ["common_res", "res_i18n"];
    }

    start(): void {
        App.UI.open(UILoading);
    }

    initSdk(): Promise<boolean> {
        return Promise.resolve(true);
    }

    initAssets(): Promise<boolean> {
        return Promise.resolve(true);
    }

    login(): Promise<ICommonRes> {
        return Promise.resolve({
            success: true,
        })
    }

    getUserInfo(): Promise<ICommonRes> {
        return Promise.resolve({
            success: true,
        })
    }

    async startComplete(): Promise<void> {
        App.UI.close(UILoading);
        App.Event.dispatch(GlobalEvent.START_COMPLETE);
    }
}
