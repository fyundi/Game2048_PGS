import { Asset, AssetManager, assetManager, resources } from "cc";
import Singleton from "../singleton/Sington";
import { UIUtil } from "../tools/UIUtil";
import Log from "../log/Log";
/**
 *  资源管理
 */
export default class ResManager extends Singleton<ResManager> {

    private getFullPathByName(name: string) {
        if (!(window as any).ResourcesPath.hasOwnProperty(name)) {
            return name;
        }
        return (window as any).ResourcesPath[name];
    }

    /**
     * 返回资源加载的路径名
     * @param name 
     * @returns 
     */
    private getUrlByName(name: string) {
        let fullPath = this.getFullPathByName(name);
        let urls: string[] = fullPath.split('/');
        if (urls && urls.length > 0) {
            // let joinIndex = urls[0] == "resources" ? 1 : 2;
            return urls.slice(1, urls.length).join('/');
        }
        return "";
    }

    /**
     * 获取资源的bundle.name
     * 1.resources下的资源默认bundle.name = resource
     * 2.res文件夹下的资源已二级文件夹夹名为bundle名
     * @param name 
     * @returns
     */
    public getBundleName(name: string) {
        let fullPath = this.getFullPathByName(name);
        let urls: string[] = fullPath.split('/');
        if (urls && urls.length > 1) {
            return urls[0];
        }
        return "";
    }

    /**
     * 加载resources下面的资源
     * @param name 
     * @param completeCallBack 
     */
    public loadRes(name: string, completeCallBack: (error: Error, res: any) => void) {
        resources.load(this.getUrlByName(name), (err, result) => {
            completeCallBack?.(err, result);
        })
    }

    /**
     * 根据类型资源
     * @param name 
     * @param type 
     * @param completeCallBack 
     */
    public loadResByType(name: string, type: typeof Asset, completeCallBack: (error: Error, res: any) => void) {

    }

    /**
     * 同步方式加载resource下面的资源
     * @param name 
     */
    public async loadResAsync(name: string): Promise<any> {
        return new Promise(async (resolve) => {
            resources.load(this.getUrlByName(name), (err: Error, result: any) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            })
        })
    }

    /**
     * 加载AB下面的资源
     * @param name 
     * @param completeCallBack 
     */
    public loadABRes(name: string, completeCallBack: (error: Error, res: any) => void) {
        let bundleName = this.getBundleName(name);
        let bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.load(this.getUrlByName(name), (err, result) => {
                completeCallBack?.(err, result);
            });
        } else {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    completeCallBack?.(err, null);
                } else {
                    bundle.load(this.getUrlByName(name), (err, result) => {
                        completeCallBack?.(err, result);
                    });
                }
            })
        }
    }

    /**
     * 同步加载AseetBundle下面的资源
     * @param name 
     */
    public async loadABResAsync(name: string): Promise<any> {
        return new Promise(async (resolve) => {
            let bundleName = this.getBundleName(name);
            let bundle = assetManager.getBundle(bundleName);
            if (!bundle) {
                bundle = await this.loadABBundleAsync(bundleName);
            }
            if (bundle) {
                Log.print("bundle加载成功：", bundleName);
                bundle.load(this.getUrlByName(name), (err, result) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(result);
                        Log.print("res加载成功：", this.getUrlByName(name));
                    }
                });
            } else {
                resolve(null)
            }
        })
    }

    /**
     * 加载远程资源
     * 只支持图片，声音，文本类的资源
     * @param path 
     * @param completeCallBack 
     */
    public loadRemoteRes(path: string, completeCallBack: (error: Error, res: any) => void) {
        assetManager.loadRemote(path, (err, result) => {
            completeCallBack?.(err, result);
        })
    }

    /**
     * 同步加载远程资源
     * 只支持图片，声音，文本类的资源
     * @param path 
     * @param completeCallBack 
     */
    public loadRemoteResAsync(path: string): Promise<any> {
        return new Promise(async (resolve) => {
            assetManager.loadRemote(path, (err, result) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            })
        })
    }

    /**
     * 根据ab路径加载ab包
     * @param abPath 
     * @returns 
     */
    public async loadABBundleAsync(abPath: string): Promise<AssetManager.Bundle> {
        return new Promise(async (resolve) => {
            assetManager.loadBundle(abPath, (err, bundle) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(bundle);
                }
            })
        })
    }

    /**
     * 释放bundle里资源，对应表现会丢失该资源，需要重新走bundle.load
     */
    public releaseBundle(name: string) {
        var bundle = assetManager.getBundle(name);
        if (bundle) {
            bundle.releaseAll();
        }
    }

    /**
     * 移除bundle，再使用bundle内的资源需要重新走assetManager.loadBundle
     */
    public removeBundle(name: string) {
        var bundle = assetManager.getBundle(name);
        if (bundle) {
            assetManager.removeBundle(bundle);
        }
    }

    /**
     * 静态资源的释放
     * 直接释放当前资源
     * 依赖资源通过释放检查，计数为0的会进行释放
     */
    public releaseStaticAsset(asset: Asset) {
        assetManager.releaseAsset(asset)
    }


    /**
     * 动态资源的释放
     */
    public releaseDynamicsAsset(asset: Asset) {
        asset.decRef(true);
    }

    /**
     * 移除所有的bundle
     */
    public dispose() {
        assetManager.bundles.forEach(bundle => {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        });
        assetManager.releaseAll();
        UIUtil.Clear();
    }
}