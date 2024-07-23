export class ArrayUtil {
    public static isContain<T>(array: Array<T>, target: T): boolean {
        return array.some((el) => el == target);
    }

    // 移除数组中的第一个与target相等的元素
    public static remove<T>(array: Array<T>, target: T): void {
        const index = array.findIndex(el => el === target);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    // 根据对象的键值对移除数组中的元素
    public static removeByKV<T extends object>(array: Array<T>, key: string, value: any): void {
        const index = array.findIndex(el => el[key] === value);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    // 完全拷贝一份数组
    public static clone<T>(array: Array<T>): Array<T> {
        return [...array]; // 使用扩展运算符进行浅拷贝
    }
}
