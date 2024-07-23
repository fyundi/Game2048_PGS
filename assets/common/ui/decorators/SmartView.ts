import { Button, Label, Sprite, error, isValid, js } from "cc";
import App from "../../App";
import { EnumLanType } from "../../i18n/LocalizationMgr";

const bindingsMap = new WeakMap();

//定义文本多语言参数类型
export interface IVSI18n {
    type?: EnumLanType,
    params?: any[]
}

/**
 * 通过 属性名称 或者标签查询对应的node 或组件
 * @example
 * 
 *  @vst(Label) //查找名节点称为icon的Label组件
 *  icon:Label = null;
 *
 *  @vst(Label,"aa") //查找名节点称为aa的Label组件，并赋值给version
 *  version:Label = null;
 *
 * @param className 组件名称
 * @param tag 名称
 * @returns
 */
export function vst(className: any, tag?: string) {
    return (target: any, propertyKey: string) => {
        let targetBinding = bindingsMap.get(target) || {};
        let properties = targetBinding["vsearch"] || [];
        properties.push({ tag: tag, name: propertyKey, className: className });
        targetBinding["vsearch"] = properties;
        bindingsMap.set(target, targetBinding);
    };
}

/**
 * 绑定多语言
 * 通过 属性名称 或者标签查询对应的node 或组件
 * @example
 *  @vsI18n("reconnectTip", {type:EnumLanType.default, params:[]}) //绑定多语言key,type, 参数
 *  @vst(Label) //查找名节点称为lbl_test的Label组件
 *  lbl_test:Label = null;
 *
 * @param key 对应语言包key
 * @param tag 对应语言包类型
 * @returns
 */
export function vsI18n(key: string, tag?: IVSI18n) {
    return (target: any, propertyKey: string) => {
        let targetBinding = bindingsMap.get(target) || {};
        let properties = targetBinding["vsI18n"] || [];
        properties.push({ tag: tag, name: propertyKey, key: key });
        targetBinding["vsI18n"] = properties;
        bindingsMap.set(target, targetBinding);
    };
}

/**
 * 绑定多语言图片资源
 * 通过 属性名称 或者标签查询对应的node 或组件
 * @example
 *  @vsI18nSprite("img_game_cancel")
 *  @vst(Sprite) //查找名节点称为sp_test的Sprite组件
 *  sp_test:Sprite = null;
 *
 * @param key 对应多语言图片文件名key
 * @param tag 空
 * @returns
 */
export function vsI18nSprite(key: string, tag?: IVSI18n) {
    return (target: any, propertyKey: string) => {
        let targetBinding = bindingsMap.get(target) || {};
        let properties = targetBinding["vsI18nSprite"] || [];
        properties.push({ tag: tag, name: propertyKey, key: key });
        targetBinding["vsI18nSprite"] = properties;
        bindingsMap.set(target, targetBinding);
    };
}

/**
 * 绑定点击事件
 * @param {string | function } handler 处理点击事件的方法名称或者方法
 * @param {any} tag  用户自定义数据
 * @returns
 *
 *
 * @example
 *
 *  @vclick("clickBtn", 1) //绑定当前类里的 clickBtn 并填入 自定义数据 1
 *  @vst(Button)
 *  addBtn: Button = null;
 *
 *  @vclick(function(b,data){ //function this可以直接操作当前类
 *     log(`click btn ${b.name}-- ${data}`)
 *     this.data.isshow = !this.data.isshow;
 *   }, 2)
 *  @vst(Node)
 *  btn: Node = null;
 *
 */
export function vclick(handler: any, tag?: any) {
    return (target: any, propertyKey: string) => {
        let targetBinding = bindingsMap.get(target) || {};
        let properties = targetBinding["vclick"] || [];
        properties.push({ tag: tag, name: propertyKey, handler: handler });
        targetBinding["vclick"] = properties;
        bindingsMap.set(target, targetBinding);
    };
}


/**
 * 通过 路径查找组件
 * @example
 * 
 *  @vsp(Label, "_uiContent/ui/label") //查找名节路径为_uiContent/ui/label的label组件
 *  icon:Label = null;
 *
 *
 * @param className 组件名称
 * @param tag 名称
 * @returns
 */
export function vsp(className: any, path: string) {
    return (target: any, propertyKey: string) => {
        let targetBinding = bindingsMap.get(target) || {};
        let properties = targetBinding["vsearch"] || [];
        properties.push({ path: path, name: propertyKey, className: className });
        targetBinding["vsearch"] = properties;
        bindingsMap.set(target, targetBinding);
    };
}

function cacheAllChildrenNodes(parent: any, map: Map<string, Node>) {
    map.set(parent.name, parent);
    let children = parent.children;
    for (const key in children) {
        if (!isValid(children[key])) continue;
        cacheAllChildrenNodes(children[key], map);
    }
}

const injectVSearch = function (key, targetBinding) {
    let properties = targetBinding["vsearch"] || [];
    if (properties.length == 0) return;

    let allNodes = new Map();
    // 先找到所有的节点缓存起来
    cacheAllChildrenNodes(this.node, allNodes);
    // 扫描所有属性，找到对应名称的属性
    for (const prop of properties) {
        let className = prop.className;
        let tag = prop.tag || prop.name;
        let path = prop.path;

        let instance;
        if (path) {
            // 有路径可以直接通过路径查找
            instance = this.node.getChildByPath(path);
        } else {
            instance = allNodes.get(tag);
        }

        if (className.prototype.__classname__ != "cc.Node") {
            instance = instance?.getComponent(className) ?? null;
        }

        if (instance == null) {
            error(`没有找到属性 ${key}->${tag}`);
            continue;
        }

        this[prop.name] = instance;
    }

};

const injectVClick = function (key, targetBinding) {
    let properties = targetBinding["vclick"] || [];

    let getButtonNode = (obj) => {
        let button = null;
        let buttonNode = null;
        buttonNode = obj instanceof Node ? obj : obj.node;
        button = buttonNode.getComponent(Button);
        if (!button) {
            button = buttonNode.addComponent(Button);
        }
        return buttonNode;
    };

    for (const property of properties) {
        let { tag, name, handler } = property;

        let func = null;
        if ("string" == typeof handler) {
            func = this[handler];
        } else {
            func = handler;
        }

        if (!func) {
            error(`没有找到function ${handler}`);
            continue;
        }

        getButtonNode(this[name]).on(
            "click",
            (button) => {
                func.call(this, button, tag);
            },
            this
        );
    }
};

const injectI18n = function (key, targetBinding) {
    let properties = targetBinding["vsI18n"] || [];
    let getLabelComp = (obj) => {
        let lableNode = obj instanceof Node ? obj : obj.node;
        let label = lableNode.getComponent(Label);
        if (!label) label = lableNode.addComponent(Label);
        return label;
    };

    for (const property of properties) {
        let { tag, name, key } = property;
        let lanType: EnumLanType = tag && tag?.type || EnumLanType.default;
        let params = tag && tag?.params || [];
        getLabelComp(this[name]).string = App.Localization.getLan(lanType, key, params)
    }
};

const injectI18nSprite = async function (key, targetBinding) {
    let properties = targetBinding["vsI18nSprite"] || [];
    let getSpriteComp = (obj) => {
        let lableNode = obj instanceof Node ? obj : obj.node;
        let sprite = lableNode.getComponent(Sprite);
        if (!sprite) sprite = lableNode.addComponent(Sprite);
        return sprite;
    };

    for (const property of properties) {
        let { tag, name, key } = property;

        let sprite = getSpriteComp(this[name]);
        let resPath = App.Localization.getFullPath(key, "spriteFrame");
        //TODO 
        // let res = await App.asyncGetI18nRes(resPath);
        // if (res && sprite) sprite.spriteFrame = res;
    }
};


export function sv(target: any) {
    const onLoad = target.prototype.onLoad;
    /**
     * 重载onload 注入更新
     */
    target.prototype.onLoad = function () {
        let classKey = js.getClassName(target);
        let targetBinding = bindingsMap.get(target.prototype) || {};
        
        injectVSearch.call(this, classKey, targetBinding);
        injectVClick.call(this, classKey, targetBinding);
        injectI18n.call(this, classKey, targetBinding);
        injectI18nSprite.call(this, classKey, targetBinding);

        //调用之前的onload
        onLoad?.call(this);
    };
}
