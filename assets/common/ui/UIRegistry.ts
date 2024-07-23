import Singleton from "../singleton/Sington";

/**
 *  UI注册器类
 */
export class UIRegistry extends Singleton<UIRegistry> {
    private registryMap: Map<string, any>;

    public registerUI(key: string, uiClass: any): void {
        this.registryMap.set(key, uiClass);
    }

    public getUI(key: string): any {
        return this.registryMap.get(key);
    }
}