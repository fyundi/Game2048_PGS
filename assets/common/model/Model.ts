import Log from "../log/Log";
export default class Model {
    injection(data: any, exclude?: string[]) {
        if (data) {
            var isField: boolean;
            var value: any;
            for (var key in data) {
                if (!exclude || exclude.indexOf(key) == -1) {
                    isField = key in this;
                    if (isField) {
                        value = data[key];
                        this.copyValue(key, value);
                    }
                }
            }
        }
    }

    injectionInclude(data: any, include: string[]) {
        var len: number = include.length;
        var key: string;
        var isField: boolean;
        for (var i: number = 0; i < len; i++) {
            key = include[i];
            isField = key in this;
            if (isField) {
                this.copyValue(key, data[key]);
            } else {
                Log.print("未找到字段：" + key);
            }
        }
    }

    private copyValue(key: string, value: any) {
        var type: string = typeof value;
        switch (type) {
            case "number":
            case "string":
            case "boolean":
                this[key] = value;
                break;
            case "object":
                if (value instanceof Array) {
                    this[key] = value;
                }
                break;
        }
    }
}