import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import { getCurrentCellsByArea, getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'


import { CellAttrs, CellStore, CellStoreContext } from './CellStore'


class ToolBarStore {



    @action.bound
    mergeCell(cellStore: CellStore) {
        let cells = getCurrentCellsByArea(cellStore.selectArea, cellStore.cellsMap)

        cellStore.mergeCell(cells)
        let first = cells[0]
        let last = cells[cells.length - 1]

        // first!.width = last!.x - first!.x + last!.width
        // first!.height = last!.y - first!.y + last!.height
        // cells.forEach(i=>{
        //     i!.fill = 'red'
        // })

        cellStore.setActiveCell({
            ...first,
            width: last!.x - first!.x + last!.width,
            height: last!.y - first!.y + last!.height,
        } as CellAttrs)

        cellStore.setSelectArea(null)


    }





    //   @computed
    //   get getcells() {

    //   }

}

export const ToolBarStoreContext = createContext(new ToolBarStore())