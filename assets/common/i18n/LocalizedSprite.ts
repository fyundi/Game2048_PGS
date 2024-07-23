
import { _decorator, Component, SpriteFrame, Sprite } from 'cc';
import { LocalizationMgr } from './LocalizationMgr';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedSpriteItem')
class LocalizedSpriteItem {
    @property
    language: string = 'zh_CN';
    @property({
        type: SpriteFrame,
    })
    spriteFrame: SpriteFrame | null = null;
}

@ccclass('LocalizedSprite')
@executeInEditMode
export class LocalizedSprite extends Component {
    sprite: Sprite | null = null;

    @property({
        type: LocalizedSpriteItem,
    })
    spriteList = [];

    onLoad() {
        this.fetchRender();
    }

    fetchRender () {
        let sprite = this.getComponent('cc.Sprite') as Sprite;
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite();
            return;
        } 
    }

    updateSprite () {
        for (let i = 0; i < this.spriteList.length; i++) {
            const item = this.spriteList[i];
            if (item.language === LocalizationMgr.ins.curLanguage) {
                if(this.sprite == null) {
                    let sprite = this.getComponent('cc.Sprite') as Sprite;
                    this.sprite = sprite;
                }
                this.sprite && (this.sprite.spriteFrame = item.spriteFrame);
                break;
            }
        }
    }
}
