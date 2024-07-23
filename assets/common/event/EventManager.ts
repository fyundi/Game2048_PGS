import Log from "../log/Log";
import Singleton from "../singleton/Sington";
export type EventManagerCallFunc = (eventName: string, eventData: any) => void;

interface CallBackTarget {
    callBack: EventManagerCallFunc,
    target: any,
}

export class EventManager extends Singleton<EventManager> {
    private _eventListeners: { [key: string]: CallBackTarget[] } = {};

    private getEventListenersIndex(eventName: string, callBack: EventManagerCallFunc, target?: any): number {
        let index = -1;
        for (let i = 0; i < this._eventListeners[eventName].length; i++) {
            let iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    }

    addEventListener(eventName: string, callBack: EventManagerCallFunc, target?: any): boolean {
        if (!eventName) {
            Log.print("eventName is empty" + eventName);
            return;
        }

        if (null == callBack) {
            Log.print('addEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];

        } else {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }

        return true;
    }

    setEventListener(eventName: string, callBack: EventManagerCallFunc, target?: any): boolean {
        if (!eventName) {
            Log.print("eventName is empty" + eventName);
            return;
        }

        if (null == callBack) {
            Log.print('setEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        this._eventListeners[eventName] = [callTarget];
        return true;
    }

    removeEventListener(eventName: string, callBack: EventManagerCallFunc, target?: any) {
        if (null != this._eventListeners[eventName]) {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    }

    dispatch(eventName: string, eventData?: any) {
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            let callbackList: CallBackTarget[] = [];
            for (const iterator of this._eventListeners[eventName]) {
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (const iterator of callbackList) {
                iterator.callBack.call(iterator.target, eventName, eventData);
            }
        }
    }

    // 新增 once 方法
    once(eventName: string, callBack: EventManagerCallFunc, target?: any): void {
        const oneTimeCallback = (eName: string, data: any) => {
            this.removeEventListener(eName, oneTimeCallback, target); // 触发后立即移除监听
            callBack(eName, data); // 调用原始回调
        };
        this.addEventListener(eventName, oneTimeCallback as EventManagerCallFunc, target); // 使用包装后的回调进行添加
    }
}