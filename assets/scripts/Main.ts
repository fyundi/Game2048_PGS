import { _decorator, Component } from 'cc';
import GlobalConfig from '../common/GlobalConfig';
import StringUtil from '../common/tools/StringUtil';
import { EnumPlatform } from '../common/CommonDefine';
import { IPlatform } from '../common/platfrom/IPlatform';
import { WebPlatform } from '../common/platfrom/WebPlatform';
import WxPlatform from '../common/platfrom/WxPlatform';
import App from '../common/App';
import { ILans } from '../common/i18n/LocalizationMgr';
import { LanDatas } from './GameConst';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    async start() {
        let urlObj = StringUtil.parseQueryObject();
        GlobalConfig.isRelease = Boolean(urlObj && urlObj["release"]) || false;

        let plat: IPlatform = this.getPlatform(urlObj);
        let lanSet: ILans = {
            defaultLanSet: urlObj && urlObj["lan"] || "zh_CN",
            lan: LanDatas
        }
        await App.init(plat, lanSet);
    }
    

    private getPlatform(urlObj: any): IPlatform {
        let platform: IPlatform;
        switch (urlObj["env"]) {
            case EnumPlatform.Web:
                platform = new WebPlatform();
                break;
            default:
                platform = new WxPlatform();
                break;
        }
        return platform;
    }

}

