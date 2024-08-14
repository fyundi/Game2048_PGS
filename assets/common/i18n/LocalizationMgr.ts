import { director, _decorator } from "cc";
import { LocalizedLabel } from "./LocalizedLabel";
import { LocalizedSprite } from "./LocalizedSprite";
import StringUtil from "../tools/StringUtil";
import Log from "../log/Log";
import { I18nSprite } from "./I18nSprite";
import App from "../App";
import Singleton from "../singleton/Sington";

export enum EnumLanType {
    default,
    server
}

export interface ILans {
    defaultLanSet: string,   //默认语言
    lan: any,   //语言表文件
    serverLan?: any //可选语言表文件
}

export class LocalizationManager extends Singleton<LocalizationManager> {
    private _curLanguage: string;
    protected _languages: any;
    protected _serverLanguages: any; //服务器语言包，基本用于toast

    public set curLanguage(lan: string) {
        if (this._curLanguage != lan) {
            this._curLanguage = lan;
            this.changeCurrentLanguage();
        }
    }

    public initLans(lanObj: ILans) {
        this._curLanguage = lanObj.defaultLanSet;
        this._languages = lanObj.lan;
        this._serverLanguages = lanObj?.serverLan
    }

    public get curLanguage() {
        return this._curLanguage;
    }

    public getLan(type: EnumLanType, key: string, ...rest) {
        let data;
        switch (type) {
            case EnumLanType.server:
                data = this._serverLanguages?.[this._curLanguage];
                break;
            default:
                data = this._languages?.[this._curLanguage];
                break;
        }

        if (!data) {
            Log.error("lans need set!!!")
            return key;
        }
        const searcher = key.split('@');
        for (let i = 0; i < searcher.length; i++) {
            data = data[searcher[i]];
            if (data == null) {
                return '';
            }
        }
        var res: string = data ? StringUtil.substitute(data, ...rest) : null;
        return res || '';
    }

    updateSceneRenderers() { // very costly iterations
        const rootNodes = director.getScene()!.children;
        // walk all nodes with localize label and update
        const allLocalizedLabels: LocalizedLabel[] = [];
        for (let i = 0; i < rootNodes.length; ++i) {
            let labels = rootNodes[i].getComponentsInChildren(LocalizedLabel);
            Array.prototype.push.apply(allLocalizedLabels, labels);
        }
        for (let i = 0; i < allLocalizedLabels.length; ++i) {
            let label = allLocalizedLabels[i];
            if (!label.node.active) continue;
            label.updateLabel();
        }

        const allI18nSprites: I18nSprite[] = [];
        for (let i = 0; i < rootNodes.length; ++i) {
            let sprites = rootNodes[i].getComponentsInChildren(LocalizedSprite);
            Array.prototype.push.apply(allI18nSprites, sprites);
        }
        for (let i = 0; i < allI18nSprites.length; ++i) {
            let sprite = allI18nSprites[i];
            if (!sprite.node.active) continue;
            sprite.updateSprite();
        }
    }

    changeCurrentLanguage() {
        this.updateSceneRenderers();
    }

    public getFullPath(resPath: string, ext?: string) {
        return ext ? `${this._curLanguage}/${resPath}/${ext}` : `${this._curLanguage}/${resPath}`
    }
}
