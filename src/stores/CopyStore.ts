import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {
    getCurrentCellsByArea,
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCellsByMergeKey,
    getCurrentCellsRectByArea,
} from '@/utils'

import {
    BorderStyle,
    CellAttrs,
    CellMap,
    CellStore,
    CellStoreContext,
    // SelectArea,
} from './CellStore'
import { defaultBorderStyle } from '@/utils/constants'

export type CopyCurrentArea = {
    left: number
    top: number
    bottom: number
    right: number
} | null

class CopyStore {
    @observable
    currentCopyArea: CopyCurrentArea = null



    @action.bound
    async copyCurrentCells(cellStore: CellStore) {
        if (cellStore.selectArea) {
            this.currentCopyArea = cellStore.selectArea
            let arr = getCurrentCellsRectByArea(cellStore.selectArea,cellStore.cellsMap)

            await navigator.clipboard.writeText(JSON.stringify(arr))


        } else if (cellStore.activeCell) {
            let cur = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )
            this.currentCopyArea = {
                left:cur!.x,
                top:cur!.y,
                bottom:cur!.y+cur!.height,
                right:cur!.x+cur!.width
            }

            let arr = getCurrentCellsRectByArea(this.currentCopyArea,cellStore.cellsMap)

            await navigator.clipboard.writeText(JSON.stringify(arr))
        }
    }

    @action.bound
    async pasteCurrentCells(cellStore: CellStore) {
        
        let first = null
        if (cellStore.selectArea) {
            first = getCurrentCellsByArea(cellStore.selectArea,cellStore.cellsMap)[0]
        } else if (cellStore.activeCell) {
            let cur:any = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )
            first = cur
        }

        const o = JSON.parse(await navigator.clipboard.readText())

        if (o && o.length && first) {
            var m = o.length,n = o[0].length

            var firstRow = Number(first.ownKey.split(':')[0])
            var firstCol = Number(first.ownKey.split(':')[1])
    
            for (var i = 0 ; i < m ; i++) {
                for (var j = 0 ; j < n ; j++) {
                    var c:any = cellStore.cellsMap[(i+firstRow)+':'+(j+firstCol)]
                    var _o = o[i][j]
                    delete _o.ownKey // 把原来的ownkey清除
                    for (var key in c) {
                        if (_o[key]) {
                            c[key] = _o[key]
                        }
                    }
                    
                }
            }
        }

    }

    @action.bound
    changeFloatImage(o: any) {}
}

export const CopyStoreContext = createContext(new CopyStore())
