import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {
    clearCellFromat,
    generaCell,
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCurrentCellsByArea,
} from '@/utils'
import { columnStopIndex, headerCell, leftCell, rowStopIndex } from '@/utils/constants'

export type BorderStyle = {
    color?: string
    strokeDash?: number[]
}
export type CellAttrs = {
    x: number
    y: number
    width: number
    height: number
    value?: string
    key?: string
    type?: string
    ownKey: string
    fill?: string
    isMerge?: string[]
    borderStyle?: BorderStyle
    fontWeight?: string | boolean
    textColor?: string
    verticalAlign?: string
    align?: string
    fontFamily?: string
    fontSize?: number
    fontItalic?: string | boolean
    textDecoration?: string | boolean
    imgUrl?: string
    imgLoaded?: boolean
    noEdit?: boolean
} | null

export type RCCellAttrs = {
    clientX: number
    clientY: number
} & CellAttrs | null

export type CellMap = {
    [key: string]: CellAttrs
}

export type SelectArea = {
    left: number
    top: number
    bottom: number
    right: number
    // width:number,
    // height:number,
    border?: boolean
} | null

export class CellStore {
    @action.bound
    mergeCell(list: CellAttrs[]) {
        if (list.length < 2) return
        var mergekey: string[] = [
            list[0]!.ownKey,
            list[list.length - 1]!.ownKey,
        ]
        list.forEach((i, index) => {
            if (index != list.length - 1) {
                // i!.value = ''
                clearCellFromat(i)
            }
        })
        for (var key in this.cellsMap) {
            if (_.find(list, { ownKey: key })) {
                this.cellsMap[key]!.isMerge = mergekey
            } else {
                this.cellsMap[key]!.isMerge =
                    this.cellsMap[key]!.isMerge == undefined
                        ? undefined
                        : this.cellsMap[key]!.isMerge
            }
        }
    }

    @action.bound
    splitCell(list: CellAttrs[]) {
        // var mergekey:string[] = [list[0]!.ownKey,list[list.length-1]!.ownKey]
        list.forEach((i, index) => {
            i!.isMerge = undefined
        })
        // for (var key in this.cellsMap) {
        //     if (_.find(list,{ownKey:key})) {
        //         this.cellsMap[key]!.isMerge = mergekey
        //     } else {
        //         this.cellsMap[key]!.isMerge = this.cellsMap[key]!.isMerge == undefined ? undefined : this.cellsMap[key]!.isMerge
        //     }
        // }
    }

    @action.bound
    fillCell(color: string, list: CellAttrs[]) {
        list.forEach((i, index) => {
            i!.fill = color
        })
    }

    @action.bound
    areaHeaderCell(ownKey: string) {
        // console.log(mergekey)\
        var list = []
        for (var key in this.cellsMap) {
            var item = this.cellsMap[key]
            if (item?.ownKey.split(':')[1] == ownKey.split(':')[1]) {
                if (item.type == 'normal') {
                    list.push(item)
                }
            }
        }

        var o = {
            left: list[0].x,
            top: list[0].y,
            bottom: list[list.length - 1].y + list[list.length - 1].height,
            right: list[0].x + list[0].width,
            border: true,
        }
        this.selectStart = getCurrentCellByXY(o.left, o.top, this.cellsMap)
        this.selectEnd = getCurrentCellByXY(
            o.left,
            list[list.length - 1].y,
            this.cellsMap
        )

        this.setSelectArea(o)
        this.setActiveCell(null)
    }

    @action.bound
    areaLeftCell(ownKey: string) {
        // console.log(mergekey)\
        var list = []
        for (var key in this.cellsMap) {
            var item = this.cellsMap[key]
            if (item?.ownKey.split(':')[0] == ownKey.split(':')[0]) {
                if (item.type == 'normal') {
                    list.push(item)
                }
            }
        }

        var o = {
            left: list[0].x,
            top: list[0].y,
            bottom: list[list.length - 1].y + list[list.length - 1].height,
            right: list[list.length - 1].x + list[list.length - 1].width,
            border: true,
        }

        this.selectStart = getCurrentCellByXY(o.left, o.top, this.cellsMap)
        this.selectEnd = getCurrentCellByXY(
            list[list.length - 1].x,
            list[list.length - 1].y,
            this.cellsMap
        )

        this.setSelectArea(o)
        this.setActiveCell(null)
    }

    // tempx:number = 0

    @action.bound
    changeWidth(ownKey: string, newwidth: number) {
        var copy: CellMap = this.cellsMap

        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[1]

            let rk = ownKey.split(':')[1]
            // console.log(ownKey)
            if (lk == rk) {
                item!.width = newwidth
                // console.log(item?.width)
            }
        }

        this.cellsMap = generaCell(copy, this.rowStopIndex, this.columnStopIndex)
    }

    @action.bound
    changeHeight(ownKey: string, newheight: number) {
        // return
        var copy: CellMap = this.cellsMap

        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[0]

            let rk = ownKey.split(':')[0]
            // console.log(ownKey)
            if (lk == rk) {
                item!.height = newheight
            }
        }

        this.cellsMap = generaCell(copy, this.rowStopIndex, this.columnStopIndex)
    }

    @action.bound
    setSelectFillAreaCell(area: SelectArea, current: CellAttrs) {
        let cells = getCurrentCellsByArea(area, this.cellsMap)

        let len = cells.length

        if (cells.some((i) => i?.isMerge)) {
            alert('若要执行此操作，所有单元格大小需相同')
            return
        }

        cells.forEach((item, index) => {
            item!.fill = current?.fill
            if (current?.value && !isNaN(Number(current?.value))) {
                item!.value = (Number(current?.value) + index).toString()
            } else {
                item!.value = current?.value
            }

            item!.borderStyle = current?.borderStyle
            item!.fontFamily = current?.fontFamily
            item!.fontWeight = current?.fontWeight
            item!.align = current?.align
            item!.fontItalic = current?.fontItalic
            item!.textDecoration = current?.textDecoration
            item!.fontSize = current?.fontSize
            item!.verticalAlign = current?.verticalAlign
            item!.textColor = current?.textColor
            item!.imgUrl = current?.imgUrl
        })
    }

    @action.bound
    imgLoadedCell(ownKey: string) {
        this.cellsMap[ownKey]!.imgLoaded = true
    }

    @action.bound
    addCellRowBelow(ownKey: string) {
        var row = Number(ownKey.split(':')[0])


        this.rowStopIndex++

        var _copy: CellMap = this.cellsMap

        const getPrevMergeK = (rowIndex: number, columnIndex: number, type: string) => {

            if (type == 'first') {
                if (rowIndex > row) {
                    return (rowIndex + 1) + ':' + (columnIndex)
                }
            }
            if (type == 'last') {
                if (rowIndex > row) {
                    return (rowIndex + 1) + ':' + (columnIndex)
                }
            }
            return (rowIndex) + ':' + (columnIndex)
        }

        const getMerge = (ov: string[], rowIndex: number) => {

            let res = ov || []
            if (res && res.length) {
                var first = res[0];
                var firstRow = Number(first.split(':')[0])
                var fristCol = Number(first.split(':')[1])
                res[0] = getPrevMergeK(firstRow, fristCol, 'first')

                var last = res[1]
                var lastRow = Number(last.split(':')[0])
                var lastCol = Number(last.split(':')[1])

                res[1] = getPrevMergeK(lastRow, lastCol, 'last')

                // 发现上一个是merge，就清除
                if (rowIndex - 1 == row && lastRow == row) {
                    return undefined
                }
            }

            return res.length == 2 ? res : undefined
        }


        const getPrevV = (ov: any, rowIndex: number) => {
            if (rowIndex - 1 == row) {
                return undefined
            }

            return ov
        }

        const getPrevK = (rowIndex: number, columnIndex: number) => {
            if (rowIndex >= row + 1) {
                return (rowIndex - 1) + ':' + columnIndex
            }

            return (rowIndex) + ':' + columnIndex
        }

        this.cellsMap = generaCell(_copy, this.rowStopIndex, this.columnStopIndex, { getPrevK, getMerge, getPrevV })


    }

    @action.bound
    addCellRowRight(ownKey: string) {
        var col = Number(ownKey.split(':')[1])


        this.columnStopIndex++
        // this.cellsMap = generaCell(copy,this.rowStopIndex,this.columnStopIndex)

        var _copy: CellMap = this.cellsMap

        const getPrevMergeK = (rowIndex: number, columnIndex: number, type: string) => {

            if (type == 'first') {
                if (columnIndex > col) {
                    return (rowIndex) + ':' + (columnIndex+1)
                }
            }
            if (type == 'last') {
                if (columnIndex > col) {
                    return (rowIndex) + ':' + (columnIndex + 1)
                }
            }
            return (rowIndex) + ':' + (columnIndex)
        }

        const getMerge = (ov: string[], rowIndex: number,columnIndex:number) => {

            let res = ov || []
            if (res && res.length) {
                var first = res[0];
                var firstRow = Number(first.split(':')[0])
                var fristCol = Number(first.split(':')[1])
                res[0] = getPrevMergeK(firstRow, fristCol, 'first')

                var last = res[1]
                var lastRow = Number(last.split(':')[0])
                var lastCol = Number(last.split(':')[1])

                res[1] = getPrevMergeK(lastRow, lastCol, 'last')

                // 发现上一个是merge，就清除
                if (columnIndex - 1 == col && columnIndex == col) {
                    return undefined
                }
            }

            return res.length == 2 ? res : undefined
        }


        const getPrevV = (ov: any, rowIndex: number,columnIndex:number) => {
            if (columnIndex - 1 == col) {
                return undefined
            }

            return ov
        }

        const getPrevK = (rowIndex: number, columnIndex: number) => {
            if (columnIndex >= col + 1) {
                return (rowIndex) + ':' + (columnIndex-1)
            }

            return (rowIndex) + ':' + columnIndex
        }

        this.cellsMap = generaCell(_copy, this.rowStopIndex, this.columnStopIndex, { getPrevK, getMerge, getPrevV })


    }

    // @action.bound
    // activeHeader(left: number, right: number) {

    //     for (var key in this.cellsMap) {
    //         var item:any = this.cellsMap[key]

    //         if (item?.type == 'header') {
    //             if (item.x >= left && item.x < right) {
    //                 item!.fill = '#e9eaed'
    //             } else {
    //                 item!.fill = headerCell.fill
    //             }
    //         }
    //     }
    // }

    // @action.bound
    // activeLeft(top: number, bottom: number) {

    //     for (var key in this.cellsMap) {
    //         var item:any = this.cellsMap[key]

    //         if (item?.type == 'left') {
    //             if (item.y >= top && item.y < bottom) {
    //                 item!.fill = '#e9eaed'
    //             } else {
    //                 item!.fill = leftCell.fill
    //             }
    //         }
    //     }
    // }

    @action.bound
    setSelectArea(o: SelectArea) {
        this.selectArea = o
    }

    @action.bound
    setActiveCell(o: CellAttrs) {
        this.activeCell = o
    }

    @action.bound
    setSelectFillArea(o: SelectArea) {
        this.selectFillArea = o
    }

    @observable
    rowStopIndex: number = rowStopIndex

    @observable
    columnStopIndex: number = columnStopIndex

    @observable
    cellsMap: CellMap = generaCell({}, this.rowStopIndex, this.columnStopIndex)



    @observable
    selectArea: SelectArea = null

    @observable
    selectFillArea: SelectArea = null

    @observable
    activeCell: CellAttrs = null

    @observable
    selectStart: CellAttrs = null

    @observable
    selectEnd: CellAttrs = null


    //   @computed
    //   get getcells() {

    //   }
}

export const CellStoreContext = createContext(new CellStore())
