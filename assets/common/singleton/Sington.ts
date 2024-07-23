export default class Singleton<T> {
    private static _instance;

    public static intance<T>(c : {new() : T}) : T {
        if(!this._instance) {
            this._instance = new c();
            // this._instance.init();
        }
        return this._instance;
    }

    protected init() {

    }
}