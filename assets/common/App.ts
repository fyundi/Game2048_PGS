import { Component, director, Node } from "cc";
import { EventManager } from "./event/EventManager";
import { IPlatform } from "./platfrom/IPlatform";
import { AppComponent } from "./component/AppComponent";
import HttpManager from "./http/HttpMgr";
import { EnumLanType, ILans, LocalizationManager } from "./i18n/LocalizationMgr";
import ResManager from "./res/ResManager";
import UIManager from "./ui/UIManager";
import { RoomManager } from "./room/RoomManager";
import ModelManager from "./model/ModelMgr";
import { AppProxy } from "./proxy/AppProxy";

/**全局门面类**/
export default class App {
    public static platform: IPlatform;
    public static appNode: Node;
    public static proxy: AppProxy;
    public static appComp: Component;
    public static readonly appNodeName: string = "AppRoot";

    /**
     * 初始化框架
     * 根据平台参数进行启动游戏
     * @param platform 启动平台 
     */
    public static async init(platform: IPlatform, lanObj: ILans): Promise<void> {
        //添加APP组件
        App.appNode = new Node(App.appNodeName);
        App.appNode.setPosition(-9999, -9999, -9999);
        director.addPersistRootNode(App.appNode);
        App.appComp = App.appNode.addComponent(AppComponent);
        App.proxy = new AppProxy();
        //部分单例类初始化
        App.UI.init();
        App.Localization.initLans(lanObj);
        //设置并根据平台启动流程
        this.platform = platform;
        return new Promise(async (resolve) => {
            this.platform.start();
            await this.platform.initSdk();
            await this.platform.initAssets();
            await this.platform.startComplete();
            resolve();
        })
    }

    //#region 多语言相关快捷访问
    public static getLanByType(type: EnumLanType, key: string, ...rest) {
        return App.Localization.getLan(type, key, ...rest);
    }

    public static getLan(key: string, ...rest) {
        return App.getLanByType(EnumLanType.default, key, ...rest);
    }

    public static getServerLan(key: string, ...rest) {
        return App.getLanByType(EnumLanType.server, key, ...rest);
    }
   
    //#endregion

    public static get Event(): EventManager { return EventManager.intance(EventManager) }
    public static get Http(): HttpManager { return HttpManager.intance(HttpManager) }
    public static get Res(): ResManager { return ResManager.intance(ResManager); }
    public static get UI(): UIManager { return UIManager.intance(UIManager); }
    public static get Room(): RoomManager { return RoomManager.intance(RoomManager); }
    public static get Model(): ModelManager { return ModelManager.intance(ModelManager) }
    public static get Localization(): LocalizationManager { return LocalizationManager.intance(LocalizationManager) }
}
