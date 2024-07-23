import { ICommonRes, wx } from "../CommonDefine";
import Log from "../log/Log";
import { IPlatform } from "./IPlatform";
import Platform from "./Platform";

export default class WxPlatform extends Platform {


    async startComplete(): Promise<void> {
        let res: ICommonRes = await this.login();
        if (res.success) {
            let userRes: ICommonRes = await this.getUserInfo();
            if(userRes) {
                
            }



        } else {
            //请求登录
        }


    }


    login(): Promise<ICommonRes> {
        return new Promise<ICommonRes>((resolve) => {
            Log.print("-----wechat login------");
            const loginResp: ICommonRes = { success: false };
            wx.login({
                success: (res: any) => {
                    Log.print("wechat login success", res);
                    loginResp.success = true;
                    loginResp.data = res;
                    resolve(loginResp);
                },
                fail: (res: any) => {
                    Log.print("wechat login error", res);
                    loginResp.success = false;
                    loginResp.msg = "login error";
                    loginResp.data = res;
                    resolve(loginResp);
                }
            });
        })
    }

    getUserInfo(): Promise<ICommonRes> {
        return new Promise<ICommonRes>((resolve) => {
            Log.print("-----wechat getUserInfo------");
            const loginResp: ICommonRes = { success: false };
            wx.getUserInfo({
                success: (res: any) => {
                    Log.print("wechat getUserInfo success", res);
                    loginResp.success = true;
                    loginResp.data = res;
                    resolve(loginResp);
                },
                fail: (res: any) => {
                    Log.print("wechat getUserInfo error", res);
                    loginResp.success = false;
                    loginResp.msg = "getUserInfo error";
                    loginResp.data = res;
                    resolve(loginResp);
                }
            })
        })
    }

}