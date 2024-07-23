import { director, error, instantiate, isValid, Node, Prefab, UITransform, Vec3, Widget } from "cc";
import Log from "../log/Log";
import Singleton from "../singleton/Sington";
import { UIBase } from "./UIBase";
import App from "../App";
import { ArrayUtil } from "../tools/ArrayUtil";
import { EnumUIType, IOpeningUIInfo, IUIConfig } from "./UIDefines";
import StringUtil from "../tools/StringUtil";

/**
 * UI管理器
 */
export default class UIManager extends Singleton<UIManager> {

    /**
    * key : classname
    * value: IUIConfig
    */
    private registryMap: Map<string, IUIConfig> = new Map<string, IUIConfig>();

    private _layerNode: Node;
    private _viewNode: Node;
    private _alertNode: Node;
    private _tipNode: Node;

    /** UI Root Canvas */
    private uiRootCanvasNode: Node;

    // 已打开的底层UI
    private openedLayerUI: UIBase;
    // 已打开的view层UI
    private openedViewUIList: Array<UIBase>;
    // 已打开的alert层UI
    private openedAlertUIList: Array<UIBase>;
    // 已打开的tip层UI
    private openedTipUIList: Array<UIBase>;

    private openingUIQueue: IOpeningUIInfo[] = [];
    private cacheUIMap: Map<string, UIBase>;

    public init() {
        this.openedViewUIList = new Array<UIBase>();
        this.openedAlertUIList = new Array<UIBase>();
        this.openedTipUIList = new Array<UIBase>();
        this.cacheUIMap = new Map<string, UIBase>();

        this.uiRootCanvasNode = director.getScene().getChildByName('Canvas');
        let designSize = this.uiRootCanvasNode.getComponent(UITransform).contentSize;

        for (let key in EnumUIType) {
            if (!isNaN(Number(key))) continue;   //tips: enum value为数字时候会反向映射； 需要过滤一次
            let uiParentNode = new Node(key);
            let uiTrans = uiParentNode.addComponent(UITransform)
            let widget = uiParentNode.addComponent(Widget);
            this.uiRootCanvasNode.addChild(uiParentNode);
            uiTrans.contentSize.set(designSize);
            widget.isAlignLeft = true;
            widget.isAlignRight = true;
            widget.isAlignBottom = true;
            widget.isAlignTop = true;

            switch (key) {
                case "Layer":
                    this._layerNode = uiParentNode;
                    break;
                case "View":
                    this._viewNode = uiParentNode;
                    break;
                case "Tip":
                    this._tipNode = uiParentNode;
                    break;
                case "Alert":
                    this._alertNode = uiParentNode;
                    break;
            }
        }
    }

    public registerUI(key: string, uiConfig: IUIConfig): void {
        this.registryMap.set(key, uiConfig);
    }

    public getUIConfig(key: string): IUIConfig | undefined {
        return this.registryMap.get(key);
    }

    /**
     * 打开UI界面
     * @param uiClass ui类名
     * @param uiType  ui层级
     * @param data  打开界面相关数据
     */
    public async open(uiClass: new () => UIBase, data?: any): Promise<boolean> {
        return new Promise(async (resolve) => {
            let className: string = StringUtil.getClassName(uiClass);
            const uiConfig = this.getUIConfig(className);
            if (!uiConfig) {
                error(`Open UI -> UI configuration not found for class ${className}`);
                resolve(false);
                return;
            }
            let uiPrefabName: string = uiConfig.prefabName;
            let uiType: EnumUIType = uiConfig.type;
            let uiList = this.getOpenedUIList(uiType);
            // 在已打开的列表中
            let targetUI = this.getOpenedUI(uiConfig);
            if (targetUI) {
                if (uiType == EnumUIType.Layer) {
                    this.closeUIExceptLayer(); //底层layer打开时候关闭其它层所有界面
                    this.openedLayerUI = targetUI;
                } else {
                    ArrayUtil.remove(uiList, targetUI);
                    uiList.push(targetUI);
                    this.resortUIIndex(uiList);//重排当前这一层界面list的节点顺序
                }
                Log.print("OpenUI " + uiPrefabName + " Success, From OpenedList");
                resolve(true);
                return;
            }

            // 在缓存的字典中
            if (this.cacheUIMap.has(className)) {
                targetUI = this.cacheUIMap.get(className);
                if (uiType == EnumUIType.Layer) {
                    this.closeUI(this.openedLayerUI);
                    this.closeUIExceptLayer(); //底层layer打开时候关闭其它层所有界面
                    this.openedLayerUI = targetUI;
                    targetUI.node.setParent(this.getParentNode(uiType)!);
                } else {
                    uiList.push(targetUI);
                    this.resortUIIndex(uiList);//重排当前这一层界面list的节点顺序
                    targetUI.node.setParent(this.getParentNode(uiType)!);
                }
                Log.print("OpenUI " + className + " Success, From CacheMap");
                resolve(true);
                return;
            }

            let thisOpenInfo: IOpeningUIInfo = { uiClass, data };
            if (this.isInQueue(className)) {
                resolve(true);
                Log.print(uiPrefabName + " is In Queue");
                return;
            }
            this.openingUIQueue.push(thisOpenInfo);
            let uiPrefab: Prefab = await App.Res.loadABResAsync(uiPrefabName) as Prefab;
            //如果是下载完已经不在列表中，说明被关闭了。这里直接跳过该界面即可
            // if (!ArrayUtil.isContain(this.openingUIQueue, thisOpenInfo)) {
            if (!this.isInQueue(className)) {
                this.exectuOpeningUI();
                resolve(false);
                return;
            }

            ArrayUtil.remove(this.openingUIQueue, thisOpenInfo);
            if (uiPrefab == null) {
                error("load uiprefab null, prefabName = %s", uiPrefabName);
                resolve(false);
                return;
            }
            let uiNode = instantiate(uiPrefab);
            if (uiNode == null) {
                error("instantiate uiprefab null, prefabName = %s", uiPrefabName);
                resolve(false);
                return;
            }
            let uiView = uiNode.getComponent(uiClass);
            if (uiView == null) {
                uiView = uiNode.addComponent(uiClass);
            }
            uiView.node.setPosition(Vec3.ZERO);
            uiList.push(uiView);
            this.resortUIIndex(uiList);

            if (uiType == EnumUIType.Layer) {
                this.closeUI(this.openedLayerUI);
                this.closeUIExceptLayer(); //底层layer打开时候关闭其它层所有界面
                this.openedLayerUI = uiView;
            }

            uiView.node.setParent(this.getParentNode(uiType)!);
            uiView.onOpen(data);
            this.exectuOpeningUI();
            Log.print("OpenUI " + uiPrefabName + " Success, form Instantiate");
            resolve(true);
        })
    }

    /**
     * 处理等待打开的界面
     */
    private exectuOpeningUI() {
        if (this.openingUIQueue.length > 0) {
            let openingUIInfo = this.openingUIQueue[0];
            if (openingUIInfo) {
                this.open(openingUIInfo.uiClass, openingUIInfo.data);
            } else {
                Log.error("----check openingUIQueue!!!----");
            }
        }
    }

    private getParentNode(type: EnumUIType) {
        if (type == EnumUIType.Layer) return this._layerNode
        if (type == EnumUIType.View) return this._viewNode;
        if (type == EnumUIType.Tip) return this._tipNode;
        if (type == EnumUIType.Alert) return this._alertNode;
        return null;
    }

    /**
     * 关闭界面
     * @param uiClass 
     */
    public close(uiClass: new () => UIBase) {
        let className: string = StringUtil.getClassName(uiClass);
        let uiConfig = this.getUIConfig(className);
        if (!uiConfig) {
            Log.error(`Close UI configuration not found for class ${className}`);
            return;
        }
        let uiView = this.getOpenedUI(uiConfig);
        if (uiView) {
            this.closeUI(uiView);
        } else {
            //如果在待打开界面，移除
            this.remvoeFromOpeningQueue(className);
            Log.print("ArrayRemoveByKv In OpeningUIQueue, prefabName = " + className);
        }
    }

    public closeUI(uiView: UIBase) {
        if (!uiView) return;
        let className: string = StringUtil.getClassName(uiView);
        let uiConifg = this.getUIConfig(className);
        if (!uiConifg) {
            Log.error("closeUI ui: no config check!!!!", className);
            return;
        }
        Log.print("CloseUI:" + className);
        //如果在已打开界面，则移除
        ArrayUtil.remove(this.getOpenedUIList(uiConifg.type), uiView);
        //如果在待打开界面，移除
        this.remvoeFromOpeningQueue(className);

        if (uiView.isCache) { //根据className进行缓存
            this.cacheUIMap.set(className, uiView);
            uiView.node.removeFromParent();
        } else {
            uiView.node.destroy();
        }
        //将当前layer实例重置
        if (uiConifg.type == EnumUIType.Layer) this.openedLayerUI = null;
        uiView.onClose();
    }

    private remvoeFromOpeningQueue(className: string) {
        let index = this.openingUIQueue.findIndex(el => StringUtil.getClassName(el.uiClass) === className);
        if (index !== -1) {
            this.openingUIQueue.splice(index, 1);
        }
    }

    private isInQueue(className: string) {
        let index = this.openingUIQueue.findIndex(el => StringUtil.getClassName(el.uiClass) === className);
        return index >= 0;
    }

    /**
     * 关掉除layer层以外的所有UI
     */
    private closeUIExceptLayer() {
        this.closeUIForEach(this.openedViewUIList);
        this.closeUIForEach(this.openedAlertUIList);
        this.closeUIForEach(this.openedTipUIList);
    }

    /**
     * 遍历执行closeUI.不能采用foreeach直接调用，因为closeUI里面存在移除元素操作
     * @param openList 
     */
    private closeUIForEach(openList: Array<UIBase>) {
        if (openList && openList.length > 0) {
            for (let index = openList.length - 1; index >= 0; index--) {
                let item = openList[index];
                if (item) this.closeUI(item);
            }
        }
    }

    /**
     * 重排该层UI顺序
     * @param type 
     */
    private resortUIIndex(list: Array<UIBase>) {
        for (let index = 0; index < list.length; index++) {
            let uiView = list[index];
            let className: string = StringUtil.getClassName(uiView);
            let uiConifg = this.getUIConfig(className);
            if (!uiConifg) {
                Log.error("check ui: ", className);
                continue;
            }
            uiView.node.setSiblingIndex(uiConifg.type + index + 1);
        }
    }

    private getOpenedUIList(type: EnumUIType) {
        if (type == EnumUIType.View) return this.openedViewUIList;
        if (type == EnumUIType.Alert) return this.openedAlertUIList;
        if (type == EnumUIType.Tip) return this.openedTipUIList;
        return [];
    }

    /**
     * 根据配置获取已经打开的UI
     * @param type 
     * @param prefabName 
     */
    private getOpenedUI(uiConfig: IUIConfig) {
        let configClassName: string = StringUtil.getClassName(uiConfig.uiClass)
        if (uiConfig.type == EnumUIType.Layer) {
            return this.openedLayerUI && StringUtil.getClassName(this.openedLayerUI) == configClassName ? this.openedLayerUI : null;
        } else {
            let uiList = this.getOpenedUIList(uiConfig.type);
            return uiList.find(ui => StringUtil.getClassName(ui) === configClassName);
        }
    }

    /**
     * 获取最底层的UI
     * @returns 
     */
    public getLayerUI() {
        return this.openedLayerUI;
    }

    public clearCache() {
        for (const key in this.cacheUIMap) {
            let ui = this.cacheUIMap[key];
            if (isValid(ui.node)) {
                ui.node.destroy();
            }
        }
        this.cacheUIMap.clear();
    }

    public dispose() {
        this.openingUIQueue = [];
        this.openedLayerUI = null;
        this.openedAlertUIList = [];
        this.openedTipUIList = [];
        this.openedViewUIList = [];
        this.registryMap.clear();
        this.clearCache();
    }
}