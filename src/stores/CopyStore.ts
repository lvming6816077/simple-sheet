import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {
    getCurrentCellsByArea,
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCellsByMergeKey,
    getCurrentCellsRectByArea,
    clearCellFromat,
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

    cutFlag:boolean = false

    @action.bound
    async copyCurrentCells(cellStore: CellStore) {
        this.cutFlag = false
        let arr:any = [[]]
        if (cellStore.selectArea) {
            this.currentCopyArea = cellStore.selectArea
            arr = getCurrentCellsRectByArea(cellStore.selectArea,cellStore.cellsMap)

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

            arr = getCurrentCellsRectByArea(this.currentCopyArea,cellStore.cellsMap)

        }

        try {
            await navigator.clipboard.writeText(JSON.stringify(arr))
        }catch(e){
            console.log('用户取消权限')
        }
    }

    @action.bound
    async pasteCurrentCells(cellStore: CellStore) {
        
        let first = null
        let text = null
        let o = null

        try {
            text = await navigator.clipboard.readText()

            o = JSON.parse(text)
        }catch(e){
            o = [[{value:text}]]
        }
        
        if (cellStore.activeCell) {
            let cur:any = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )
            first = cur
            

            if (this.cutFlag) {
                var list = getCurrentCellsByArea(this.currentCopyArea,cellStore.cellsMap)
                list.forEach(i=>{
                    i!.value = undefined
                })
                this.currentCopyArea = null
                await navigator.clipboard.writeText('[]')
            }
        }

        

        if (o && o.length && first) {
            var m = o.length,n = o[0].length

            var firstRow = Number(first.ownKey.split(':')[0])
            var firstCol = Number(first.ownKey.split(':')[1])
    
            for (var i = 0 ; i < m ; i++) {
                for (var j = 0 ; j < n ; j++) {
                    var c:CellAttrs|any = cellStore.cellsMap[(i+firstRow)+':'+(j+firstCol)]
                    if (!c) break
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
    async cutCurrentCells(cellStore: CellStore) {
        this.copyCurrentCells(cellStore)
        this.cutFlag = true

    }
    

    @action.bound
    changeFloatImage(o: any) {}
}

export const CopyStoreContext = createContext(new CopyStore())
