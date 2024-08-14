
import { _decorator, Component, Sprite } from 'cc';
import App from '../App';
const { ccclass, executeInEditMode } = _decorator;

//cocos编辑器下加载资源不便，暂时不处理编辑器下预览多语言的情况， 如果需要可以通过脚本输出资源uuid，然后再对应走编辑器下加载，
// const uuid = await Editor.Message.request("asset-db", "query-uuid", resPath);
// assetManager.loadAny(uuid, () => {})

// @executeInEditMode   
@ccclass('I18nSprite')
export class I18nSprite extends Component {
    private sprite: Sprite = null;
    private spriteFrameName: string = null;

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        let sprite = this.getComponent(Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.spriteFrameName = this.sprite.spriteFrame?.name;
            this.updateSprite();
        }
    }

    async updateSprite() {
        if (!this.sprite || !this.spriteFrameName) return;
        let resPath = App.Localization.getFullPath(this.spriteFrameName, "spriteFrame");
        // let res = await App.asyncGetI18nRes(resPath);
        // if (res && this.sprite) this.sprite.spriteFrame = res;
    }
}
