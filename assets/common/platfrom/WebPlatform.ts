import App from "../App";
import { ICommonRes } from "../CommonDefine";
import UILoading from "../commonUI/UILoading";
import UISimulate from "../commonUI/UISimulate";
import Log from "../log/Log";
import Platform from "./Platform";

export class WebPlatform extends Platform {

    getBundles(): string[] {
        // let baseBundles = super.getBundles();
        // baseBundles.push("")
        // return baseBundles;
        return super.getBundles();
    }

    async startComplete(): Promise<void> {
        //打开simulate界面
        let openSuccess = await App.UI.open(UISimulate);
        if (!openSuccess) {
            Log.print("OpenUI Fail: UISimulate");
        }
        super.startComplete();
    }
}