import { _decorator, Component, Label } from 'cc';
import { LocalizationMgr } from './LocalizationMgr';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedLabel')
@executeInEditMode
export class LocalizedLabel extends Component {
    label: Label | null = null;

    @property({ visible: false })
    key: string = '';
    @property({ range: [0, 2, 1] })
    lanType: number = 0;

    @property({ displayName: 'Key', visible: true })
    get _key() {
        return this.key;
    }
    set _key(str: string) {
        this.key = str;
    }

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        let label = this.getComponent('cc.Label') as Label;
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        }
    }

    updateLabel() {
        this.label && (this.label.string = LocalizationMgr.ins.getLan(this.lanType, this.key));
    }
}
