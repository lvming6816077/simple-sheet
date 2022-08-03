import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import { CellAttrs, MouseClick, RCCellAttrs } from './CellStore'

class MouseEventStore {
    lastMoveCellAttr: CellAttrs = null

    @observable
    upCellAttr: CellAttrs = null

    @observable
    downCellAttr: MouseClick = null

    @observable
    moveCellAttr: CellAttrs = null

    @observable
    dbcCellAttr: CellAttrs = null

    @observable
    rcCellAttr: RCCellAttrs = null

    @action.bound
    mouseUp(obj: CellAttrs) {
        this.upCellAttr = obj
    }

    @action.bound
    mouseDown(obj: MouseClick) {
        this.downCellAttr = obj
    }

    @action.bound
    mouseMove(obj: CellAttrs) {

        // 优化，缓存上一次的move结果，使其不会触发多次
        if (this.lastMoveCellAttr == null) {
            this.moveCellAttr = obj
            this.lastMoveCellAttr = obj
        }
        if (
            this.lastMoveCellAttr &&
            this.lastMoveCellAttr.ownKey != obj?.ownKey
        ) {
            this.moveCellAttr = obj
            this.lastMoveCellAttr = obj
        }
    }

    @action.bound
    mouseDBC(obj: CellAttrs) {
        this.dbcCellAttr = obj
    }

    @action.bound
    mouseRC(obj: RCCellAttrs) {
        this.rcCellAttr = obj
    }

    @observable
    scrollLeft: number = 0

    @observable
    scrollTop: number = 0

    @observable
    selectFilling: boolean = false
}

export const MouseEventStoreContext = createContext(new MouseEventStore())
