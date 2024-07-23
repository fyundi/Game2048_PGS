import { ImageAsset, isValid, Node, Sprite, SpriteFrame, Texture2D } from "cc";
import App from "../App";
import StringUtil from "./StringUtil";

export class UIUtil {
    private static cacheSpMap: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();
    //加载远程图片
    public static async LoadRemoteImage(path: string, sprite: Sprite) {
        if (StringUtil.isNullOrEmpty(path)) {
            console.error("LoadNetImg path error:" + path);
            return;
        }

        if (!StringUtil.checkNetUrl(path)) {
            console.error("CheckNetUrl path error:" + path);
            return;
        }

        if (this.cacheSpMap.has(path)) {
            let sp = this.cacheSpMap.get(path);
            sprite.spriteFrame = sp;
            sp.addRef();
            return;
        }

        let res = await App.Res.loadRemoteResAsync(path);
        if (res) {
            let sp = UIUtil.GetSpriteFrame(res);
            if (sp) {
                sprite.spriteFrame = sp;
                sp.addRef();
            }
        }
    }

    //改变图片
    public static async ChangeSprite(name: string, sprite: Sprite) {
        if (sprite == null) return;
        if (StringUtil.isNullOrEmpty(name)) return
        if (sprite.spriteFrame != null && sprite.spriteFrame.name == name) return;

        if (this.cacheSpMap.has(name)) {
            let sp = this.cacheSpMap.get(name);
            sprite.spriteFrame = sp;
            sp.addRef();
            return;
        }

        let res = await App.Res.loadABResAsync(name);
        if (res) {
            let sp = UIUtil.GetSpriteFrame(res);
            if (sp) {
                sprite.spriteFrame = sp;
                sp.addRef();
            }
        }
    }

    private static GetSpriteFrame(img: ImageAsset) {
        let sp = new SpriteFrame();
        let tex = new Texture2D();
        tex.image = img
        sp.texture = tex;
        return sp;
    }

    /**
     * 释放spriteFrame
     * @param sp 
     * @returns 
     */
    public static releaseSprite(sp: Sprite) {
        if (!isValid(sp.node)) return;
        if (sp && sp.spriteFrame) {
            sp.spriteFrame.decRef();
            sp.spriteFrame = null;
        }
    }

    /**
     * 图片置灰
     * 会循环遍历所有子节点，只要是图片就都置灰
     * @param sp 
     */
    public static setGray(node: Node) {
        if (node.getComponent(Sprite)) node.getComponent(Sprite).grayscale = true;
        node.children.forEach(e => {
            UIUtil.setGray(e);
        })
    }

    /**
     * 图片置灰还原
     * 会循环遍历所有子节点，只要是图片就都还原
     * @param sp 
     */
    public static getRight(node: Node) {
        if (node.getComponent(Sprite)) node.getComponent(Sprite).grayscale = false;
        node.children.forEach(e => {
            UIUtil.getRight(e);
        })
    }

    /**
     * 清空所有缓存的动态加载资源
     */
    public static Clear() {
        this.cacheSpMap.forEach((sp) => {
            sp?.destroy();
        })
        this.cacheSpMap.clear();
        this.cacheSpMap = null;
    }
}