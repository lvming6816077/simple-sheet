import { observable, action, computed } from 'mobx'
import { createContext } from 'react'

export type CellAttrs = {
    x: number,
    y: number
} | null

class MouseEventStore {
    @observable
    upCellAttr: CellAttrs = null

    @observable
    downCellAttr: CellAttrs = null

    @observable
    moveCellAttr: CellAttrs = null

    @observable
    dbcCellAttr: CellAttrs = null

    @action.bound
    mouseUp(obj: CellAttrs) {
        this.upCellAttr = obj
    }

    @action.bound
    mouseDown(obj: CellAttrs) {
        this.downCellAttr = obj
    }

    @action.bound
    mouseMove(obj: CellAttrs) {
        this.moveCellAttr = obj
    }

    @action.bound
    mouseDBC(obj: CellAttrs) {
        this.dbcCellAttr = obj
    }

    //   @computed
    //   get doubleCount() {
    //     return this.count * 2
    //   }
}

export const MouseEventStoreContext = createContext(new MouseEventStore())