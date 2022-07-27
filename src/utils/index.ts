import {
    CellAttrs,
    CellMap,
    CellStoreContext,
    SelectArea,
} from '@/stores/CellStore'
import _ from 'lodash'
import { useContext } from 'react'

import {
    headerCell,
    leftCell,
    normalCell,
    singleCell,
    // rowStopIndex,
    // columnStopIndex,
} from './constants'

export const getCurrentCellByXY = (x: number, y: number, cellsMap: CellMap) => {
    var _cells = _.values(cellsMap)
    return _cells[
        _.findIndex<CellAttrs>(_cells, {
            x: x,
            y: y,
        })
    ]
}

export const getCurrentCellByOwnKey = (
    key: string,
    cellsMap: CellMap,
    useMerge: boolean = false
) => {
    var obj = cellsMap[key]

    if (obj?.isMerge && useMerge) {
        const [firstkey, endkey] = obj?.isMerge
        const o = {
            x: cellsMap[firstkey]!.x,
            y: cellsMap[firstkey]!.y,
            width:
                cellsMap[endkey]!.x -
                cellsMap[firstkey]!.x +
                cellsMap[endkey]!.width,
            height:
                cellsMap[endkey]!.y -
                cellsMap[firstkey]!.y +
                cellsMap[endkey]!.height,
        }
        return {
            ...obj,
            ...o,
        }
    } else {
        return obj
    }
}
export const getCurrentCellsByCol = (colkey: string, cellsMap: CellMap) => {
    var _cells = _.values(cellsMap)

    return _cells.filter((i) => {
        return i?.ownKey.split(':')[1] == colkey
    })
}
export const getCurrentCellsByRow = (rowkey: string, cellsMap: CellMap) => {
    var _cells = _.values(cellsMap)

    return _cells.filter((i) => {
        return i?.ownKey.split(':')[0] == rowkey
    })
}

export const getCellsByMergeKey = (isMerge: string[], cellsMap: CellMap) => {
    let first = getCurrentCellByOwnKey(isMerge[0], cellsMap)
    let last = getCurrentCellByOwnKey(isMerge[1], cellsMap)
    let o = {
        left: first?.x,
        top: first?.y,
        bottom: last!.y + last!.height,
        right: last!.x + last!.width,
    }
    let cells = getCurrentCellsByArea(o as SelectArea, cellsMap)

    return cells
}

export const getCurrentCellsByArea = (o: SelectArea, cellsMap: CellMap) => {
    var _cells = _.values(cellsMap)
    if (!o) return []

    return _cells.filter((i) => {
        if (i && o) {
            return (
                i.x >= o.left && i.x < o.right && i.y >= o.top && i.y < o.bottom
            )
        } else {
            return false
        }
    })
}

export const getScrollWidthAndHeight = (cellsMap: CellMap,rowStopIndex:number,columnStopIndex:number) => {
    var key1 = '0:' + columnStopIndex
    var key2 = rowStopIndex + ':0'
    var w: any = cellsMap[key1]
    var h: any = cellsMap[key2]
    if (w && h) {
        return {
            swidth: w.x + w.width,
            sheight: h.y + h.height,
        }
    } else {
        return {
            swidth: 0,
            sheight: 0
        }
    }
    
}

export const getCurrentCellByNextRight = (
    cell: CellAttrs,
    cellsMap: CellMap
) => {
    var r = cell?.ownKey.split(':')[0]
    var c = Number(cell?.ownKey.split(':')[1]) + 1

    return cellsMap[r + ':' + c]
}
export const getCurrentCellByNextBottom = (
    cell: CellAttrs,
    cellsMap: CellMap
) => {
    var r = Number(cell?.ownKey.split(':')[0]) + 1
    var c = Number(cell?.ownKey.split(':')[1])

    return cellsMap[r + ':' + c]
}
export const getCurrentCellByPrevLeft = (
    cell: CellAttrs,
    cellsMap: CellMap
) => {
    var r = Number(cell?.ownKey.split(':')[0])
    var c = Number(cell?.ownKey.split(':')[1]) - 1

    return cellsMap[r + ':' + c]
}
export const getCurrentCellByPrevTop = (cell: CellAttrs, cellsMap: CellMap) => {
    var r = Number(cell?.ownKey.split(':')[0]) - 1
    var c = Number(cell?.ownKey.split(':')[1])

    return cellsMap[r + ':' + c]
}
export const clearCellFromat = (cell: CellAttrs) => {
    cell!.value = undefined
    cell!.borderStyle = undefined
    cell!.imgUrl = undefined
    cell!.fontFamily = undefined
    cell!.textColor = undefined
    cell!.verticalAlign = undefined
    cell!.fill = normalCell.fill
    cell!.align = undefined
    cell!.fontSize = undefined
    cell!.fontItalic = undefined
    cell!.textDecoration = undefined
}
export const generaCell = (prev: CellMap = {},rowStopIndex:number,columnStopIndex:number,getPrevK?:any) => {
    const getRowOffset = (
        rowIndex: number,
        columnIndex: number,
        map: CellMap
    ) => {
        const _ownKey = rowIndex - 1 + ':' + columnIndex
        const cur = map[_ownKey]

        return cur ? cur.y + (cur.height || 0) : 0
    }
    const getColumnOffset = (
        rowIndex: number,
        columnIndex: number,
        map: CellMap
    ) => {
        const _ownKey = rowIndex + ':' + (columnIndex - 1)

        const cur = map[_ownKey]

        return cur ? cur.x + (cur.width || 0) : 0
    }

    const getRowHeight = (type: string, k: string) => {
        let v = 0
        if (type == 'header') {
            v = headerCell.height
        } else if (type == 'left') {
            v = leftCell.height
        } else if (type == 'single') {
            v = singleCell.height
        } else {
            v = normalCell.height
        }

        const cur = prev[k]
        return cur ? cur.height : v
    }

    const getColumnWidth = (type: string, k: string) => {
        let v = 0
        if (type == 'header') {
            v = headerCell.width
        } else if (type == 'left') {
            v = leftCell.width
        } else if (type == 'single') {
            v = singleCell.width
        } else {
            v = normalCell.width
        }

        const cur = prev['0:'+k.split(':')[1]]
        return cur ? cur.width : v
    }

    const getType = (rowIndex: number, columnIndex: number) => {
        if (rowIndex == 0 && columnIndex == 0) return 'single'
        if (rowIndex == 0) return 'header'
        if (columnIndex == 0) return 'left'
        return 'normal'
    }

    const getFill = (type: string) => {
        if (type == 'header') {
            return headerCell.fill
        }
        if (type == 'left') {
            return leftCell.fill
        }
        if (type == 'normal') {
            return normalCell.fill
        }

        return singleCell.fill
    }

    const getMerge = (arr:string[]|undefined)=>{
        let res = arr||[]
        if (arr && arr.length && getPrevK) {
            var first = arr[0]
            res[0] = getPrevK(Number(first.split(':')[0]),Number(first.split(':')[1]),'first')
            var last = arr[1]
            res[1] = getPrevK(Number(last.split(':')[0]),Number(last.split(':')[1]),'last')

        }
        

        return res.length == 0 ? undefined : res
    }

    var map: CellMap = {}
    for (
        let rowIndex: number = 0;
        rowIndex <= rowStopIndex;
        rowIndex++
    ) {
        for (
            let columnIndex: number = 0;
            columnIndex <= columnStopIndex;
            columnIndex++
        ) {
            const type = getType(rowIndex, columnIndex)

            const x = getColumnOffset(rowIndex, columnIndex, map)

            const y = getRowOffset(rowIndex, columnIndex, map)

        
            let ownKey = rowIndex + ':' + columnIndex

            let k = ownKey
            if (getPrevK) {
                k = getPrevK(rowIndex,columnIndex)
            }

            const width = getColumnWidth(type, ownKey)

            const height = getRowHeight(type, ownKey)

            map[ownKey] = {
                x,
                y,
                width,
                height,
                type: type,
                ownKey: ownKey,
                value: ownKey,//prev[k]?.value || '',
                fill: prev[k]?.fill || getFill(type),
                isMerge: getMerge(prev[k]?.isMerge) || undefined,
                borderStyle: prev[k]?.borderStyle || undefined,
                verticalAlign: prev[k]?.verticalAlign || undefined,
                textColor: prev[k]?.textColor || undefined,
                fontWeight: prev[k]?.fontWeight || undefined,
                align: prev[k]?.align || undefined,
                fontSize: prev[k]?.fontSize || undefined,
                fontFamily: prev[k]?.fontFamily || undefined,
                fontItalic: prev[k]?.fontItalic || undefined,
                textDecoration: prev[k]?.textDecoration || undefined,
                imgUrl: prev[k]?.imgUrl || undefined,
                imgLoaded: prev[k]?.imgLoaded || undefined,
                noEdit: prev[k]?.noEdit|| undefined
            }
        }
    }

    return map
}
