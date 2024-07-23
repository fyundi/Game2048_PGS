import { view, screen } from "cc";

export default class ResolutionTool {
    private static ratioX: number = 0;
    private static ratioY: number = 0;

    private static ratioViewX: number = 0;
    private static ratioViewY: number = 0;

    public static init() {
        let designSize = view.getDesignResolutionSize();
        let frameSize = view.getFrameSize();
        let visibleSize = view.getVisibleSize();

        ResolutionTool.ratioX = frameSize.x / designSize.x;
        ResolutionTool.ratioY = frameSize.y / designSize.y;
        ResolutionTool.ratioViewX = frameSize.x / visibleSize.x;
        ResolutionTool.ratioViewY = frameSize.y / visibleSize.y;
    }

    public static setRatioViewX(appWidth: number) {
        if(appWidth && appWidth > 0){
            ResolutionTool.ratioViewX = appWidth / view.getVisibleSize().x;
        }
    }

    public static setRatioViewY(appHeight: number) {
        if(appHeight && appHeight > 0){
            ResolutionTool.ratioViewY = appHeight / view.getVisibleSize().y;
        }
    }

    public static convertDesignToCCSPixelsX(x: number): number {
        return x * ResolutionTool.ratioX;
    }

    public static convertDesignToCCSPixelsY(y: number): number {
        return y * ResolutionTool.ratioY;
    }

    public static convertCCSPixelsToDesignX(x: number): number {
        return x / ResolutionTool.ratioX;
    }

    public static convertCCSPixelsToDesignY(y: number): number {
        return y / ResolutionTool.ratioY;
    }

    public static convertViewportToCCSPixelsX(x: number): number {
        return x * ResolutionTool.ratioViewX;
    }

    public static convertViewportToCCSPixelsY(y: number): number {
        return y * ResolutionTool.ratioViewY;
    }

    public static convertViewportToDesignX(x: number): number {
        return x / ResolutionTool.ratioViewX;
    }

    public static convertViewportToDesignY(y: number): number {
        return y / ResolutionTool.ratioViewY;
    }

    public static convertViewportToDesignOppoSiteY(y: number): number {
        let visibleSize = view.getVisibleSize();
        return (visibleSize.y - y) * ResolutionTool.ratioViewY;
    }
}
