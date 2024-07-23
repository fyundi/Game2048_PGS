import { director, Director, sp } from "cc";
import { EDITOR } from "cc/env";

export class SpineUtil{
    
    
}

if (EDITOR) {
    sp.Skeleton.prototype['updateAnimation'] = function (dt) {
        this.markForUpdateRenderData();
        // if (EDITOR && !legacyCC.GAME_VIEW) return;
        if (this.paused) return;

        dt *= this._timeScale;
        if (this.isAnimationCached()) {
            // Cache mode and has animation queue.
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    const frameCache = this._frameCache;
                    if (frameCache && frameCache.isInvalid()) {
                        frameCache.updateToFrame();
                        const frames = frameCache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }
                    return;
                }
                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift()!;
                }
                this._accTime += dt;
                if (this._accTime > this._headAniInfo.delay) {
                    const aniInfo = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                }
                return;
            }

            this._updateCache(dt);
        } else {
            this._instance.updateAnimation(dt);
        }
    };
}

