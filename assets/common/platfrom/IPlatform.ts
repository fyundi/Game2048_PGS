export interface IPlatform {
    getBundles(): string[]; //需要提前加载的bundle列表

    start(): void;  //平台开始，展示loading界面
    initSdk(): Promise<boolean>;  //根据平台初始化不同的sdk实现
    initAssets(): Promise<boolean>;  //预加载bundle和资源
    startComplete(): Promise<void>; //启动完成
}