import { Label, UITransform } from "cc";

export default class StringUtil {
    /**
     * 
     * @param str  要在其中进行替换的字符串。该字符串可包含 {n} 形式的特殊标记，其中 n 为从零开始的索引，它将被该索引处的其他参数（如果指定）替换。
     * @param rest 可在 str 参数中的每个 {n} 位置被替换的其他参数，其中 n 是一个对指定值数组的整数索引值（从 0 开始）
     * @returns 
     */
    public static substitute(str: string, ...rest): string {
        var len: number = rest ? rest.length : 0;
        if (len <= 0) return str;
        var res: string, tmp: string;
        for (var i: number = 0; i < len; i++) {
            tmp = res || str;
            res = tmp.replace("{" + i + "}", rest[i]);
        }
        return res;
    }

    /**
     * 时间格式化
     * @param time 毫秒
     * @param format 需要格式化的样式 例如 YYYY-MM-DD hh:mm:ss(注意 月份（MM）和分钟(mm)的区别)
     * @returns 
     */
    public static formatDate(time: number, format: string): string {
        let date = new Date(time);
        let year = date.getFullYear().toString();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let str = format.replace(/yyyy|YYYY/, year);
        str = str.replace(/MM/, month > 9 ? month.toString() : "0" + month);
        str = str.replace(/dd|DD/, day > 9 ? day.toString() : "0" + day);
        str = str.replace(/hh|HH/, hour > 9 ? hour.toString() : "0" + hour);
        str = str.replace(/mm/, minute > 9 ? minute.toString() : "0" + minute);
        str = str.replace(/ss|SS/, second > 9 ? second.toString() : "0" + second);
        return str;
    }

    /**
     * 倒计时格式化
     * @param time 毫秒
     * @param format d 天，h时,m分，s秒
     * @returns 
     */
    public static formatCountDownTime(time: number, format: string = "dd天hh:mm:ss"): string {
        let day = time / (1000 * 60 * 60 * 24) | 0;
        let hour = time / (1000 * 60 * 60) % 24 | 0;
        let minute = time / (1000 * 60) % 60 | 0;
        let second = time / 1000 % 60 | 0;
        let str = format;

        let list = [
            [day, /dd|DD/, /d|D/],
            [hour, /hh|HH/, /h|H/],
            [minute, /mm|MM/, /m|M/],
            [second, /ss|SS/, /s|S/]
        ];
        let len = list.length;
        let arr;
        let regexp;
        let value;
        for (let i = 0; i < len; i++) {
            arr = list[i];
            value = arr[0];
            regexp = arr[1];
            if (str.match(regexp)) {
                str = str.replace(regexp, value > 9 ? value.toString() : "0" + value);
            } else {
                regexp = arr[2];
                str = str.replace(regexp, value.toString());
            }
        }
        return str;
    }

    /**
     * 字符串中是否存在特殊字符
     * @param str 
     * @returns 存在 true
     */
    public static hasSpecialStr(str): boolean {
        var specialChars = "~·`!！@#$￥%^…&*()（）—-_=+[]{}【】、|\\;:；：'\"“‘,./<>《》?？，。";
        var len = specialChars.length;
        for (var i = 0; i < len; i++) {
            if (str.indexOf(specialChars.substring(i, i + 1)) != -1) {
                return true;
            }
        }
        return false;
    }

    public static getFitString(source: string, text: Label, maxWidth: number): void {
        if (source || source == "") {
            text.string = source;
            text.updateRenderData(true);
            let tw = text.node.getComponent(UITransform).contentSize.width
            if (tw > maxWidth) {
                let len: number = source.length;
                for (var i: number = 1; i <= len; i++) {
                    text.string = source.substring(0, i) + "…";
                    text.updateRenderData(true);
                    tw = text.node.getComponent(UITransform).contentSize.width;
                    if (tw > maxWidth) {
                        text.string = source.substring(0, i - 1) + "…";
                        return
                    }
                }
            }
        }
    }

    public static numberFormat(value: number, decimalPlaces: number = 1): string {
        let sign = value >= 0 ? 1 : -1;
        let abs = Math.abs(value);
        let unit = "";
        let result = 0;

        if (abs < 1000) {
            result = abs;
        } else if (abs < 1000000) {
            result = abs / 1000;
            unit = "K";
        } else if (abs < 1000000000) {
            result = abs / 1000000;
            unit = "M";
        } else {
            result = abs / 1000000000;
            unit = "B";
        }
        result = parseFloat(result.toFixed(decimalPlaces));
        result = sign * result;
        if (Math.floor(result) === result) {
            return `${result}${unit}`;
        } else {
            return `${result.toFixed(decimalPlaces)}${unit}`;
        }
    }

    public static parseQueryObject(): { [key: string]: string } {
        const search = location.search;
        const queryObject: { [key: string]: string } = {};

        if (search.indexOf('?') !== -1) {
            const params = search.substring(1).split('&');

            params.forEach(param => {
                const keyValue = param.split('=');
                if (keyValue.length === 2) {
                    queryObject[keyValue[0]] = decodeURIComponent(keyValue[1]);
                }
            });
        }
        return queryObject;
    }

    public static checkNetUrl(httpUrl: string): boolean {
        let isHttp = /^http[s]*:\/\//;
        return isHttp.test(httpUrl)
    }

    //判断字符是否为空
    public static isNullOrEmpty(str: string): boolean {
        return str == null || str === ""
    }

    //打印map
    public static mapToString(map: Map<any, any>): string {
        return JSON.stringify(Array.from(map.entries()).reduce((o, [key, value]) => { o[key] = value; return o; }, {}))
    }

    public static getClassName(clsOrInstance: Function | any): string {
        if (typeof clsOrInstance === 'function') {// 如果参数是构造函数（类）
            return clsOrInstance.name;
        } else if (clsOrInstance && typeof clsOrInstance.constructor === 'function') {// 如果参数是类的实例
            return clsOrInstance.constructor.name;
        } else { //CHCEK!!!
            return null;
        }
    }
}
