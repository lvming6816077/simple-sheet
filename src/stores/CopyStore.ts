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
    getLastCell,
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
import { FloatImageStore } from './FloatImageStore'

export type CopyCurrentArea = {
    left: number
    top: number
    bottom: number
    right: number
} | null

class CopyStore {
    @observable
    currentCopyArea: CopyCurrentArea = null

    cutFlag: boolean = false

    @action.bound
    async copyCurrentCells(cellStore: CellStore) {
        this.cutFlag = false
        let arr: any = [[]]
        if (cellStore.selectArea) {
            this.currentCopyArea = cellStore.selectArea
            arr = getCurrentCellsRectByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )

            await navigator.clipboard.writeText(JSON.stringify(arr))
        } else if (cellStore.activeCell) {
            let cur = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )
            this.currentCopyArea = {
                left: cur!.x,
                top: cur!.y,
                bottom: cur!.y + cur!.height,
                right: cur!.x + cur!.width,
            }

            arr = getCurrentCellsRectByArea(
                this.currentCopyArea,
                cellStore.cellsMap
            )
        }

        try {
            await navigator.clipboard.writeText(JSON.stringify(arr))
        } catch (e) {
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
        } catch (e) {
            o = [[{ value: text }]]
        }

        if (cellStore.activeCell) {
            let cur: any = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
            )

            first = cur

            if (this.cutFlag) {
                var list = getCurrentCellsByArea(
                    this.currentCopyArea,
                    cellStore.cellsMap
                )
                list.forEach((i) => {
                    i!.value = undefined
                })
                this.currentCopyArea = null
                await navigator.clipboard.writeText('[]')
            }
        }

        if (o && o.length && first) {
            var m = o.length,
                n = o[0].length

            var oldFirst = o[0][0]

            var oldFirstRow = Number(oldFirst.ownKey.split(':')[0])
            var oldFirstCol = Number(oldFirst.ownKey.split(':')[1])


            var firstRow = Number(first.ownKey.split(':')[0])
            var firstCol = Number(first.ownKey.split(':')[1])
            
            var originCellMap = JSON.parse(JSON.stringify(cellStore.cellsMap))

            var lastCell = getLastCell(cellStore.cellsMap)


            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    var c: CellAttrs | any =
                        cellStore.cellsMap[i + firstRow + ':' + (j + firstCol)]
                    if (!c) break
                    if (c.isMerge) {
                        alert('不能对合并单元格做部分修改')
                        // 回复到之前的状态
                        cellStore.cellsMap = originCellMap
                        return
                        break
                    }
                    var _o = o[i][j]
                    delete _o.ownKey // 把原来的ownkey清除
                    for (var key in c) {
                        if (_o[key]) {
                            if (key == 'isMerge') {


                                var oldFirstKey = _o.isMerge[0]
                                var oldLastKey = _o.isMerge[1]
                                var l1 = Number(oldFirstKey.split(':')[0])+(firstRow-oldFirstRow)
                                var l2 = (Number(oldFirstKey.split(':')[1])+(firstCol-oldFirstCol))

                                // 处理边界
                                l1 = Math.min(Number(lastCell?.ownKey.split(':')[0]),l1)
                                l2 = Math.min(Number(lastCell?.ownKey.split(':')[1]),l2)

                                var c1 = Number(oldLastKey.split(':')[0])+(firstRow-oldFirstRow)
                                var c2 = (Number(oldLastKey.split(':')[1])+(firstCol-oldFirstCol))

                                // 处理边界
                                c1 = Math.min(Number(lastCell?.ownKey.split(':')[0]),c1)
                                c2 = Math.min(Number(lastCell?.ownKey.split(':')[1]),c2)


                                c[key] = [l1 + ':' + l2,c1 + ':' + c2]

                            } else {
                                c[key] = _o[key]
                            }
                            
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
    async delCurrentCells(
        cellStore: CellStore,
        floatImageStore: FloatImageStore
    ) {
        // 删除图片
        if (floatImageStore.currentTransformerId) {
            floatImageStore.removeFloatImage(
                floatImageStore.currentTransformerId
            )
            return
        }

        if (cellStore.selectArea) {
            let list = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            list.forEach((i) => {
                i!.value = undefined
                i!.imgUrl = undefined
                i!.imgLoaded = undefined
            })
        } else if (cellStore.activeCell) {
            let cur = getCurrentCellByOwnKey(
                cellStore.activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )

            cur!.value = undefined
            cur!.imgUrl = undefined
            cur!.imgLoaded = undefined
        }
    }

    @action.bound
    changeFloatImage(o: any) {}
}

export const CopyStoreContext = createContext(new CopyStore())
