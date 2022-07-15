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
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
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

    if (obj?.ismerge && useMerge) {
        const [firstkey, endkey] = obj?.ismerge
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

export const getCellsByMergeKey = (ismerge: string[], cellsMap: CellMap) => {
    let first = getCurrentCellByOwnKey(ismerge[0], cellsMap)
    let last = getCurrentCellByOwnKey(ismerge[1], cellsMap)
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

export const getScrollWidthAndHeight = (cellsMap: CellMap) => {
    var key1 = '0:' + columnStopIndex
    var key2 = rowStopIndex + ':0'
    var w: any = cellsMap[key1]
    var h: any = cellsMap[key2]
    return {
        swidth: w.x + w.width,
        sheight: h.y + h.height,
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

export const generaCell = (prev: CellMap = {}) => {
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

        const cur = prev[k]
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

    var map: CellMap = {}
    for (
        let rowIndex: number = rowStartIndex;
        rowIndex <= rowStopIndex;
        rowIndex++
    ) {
        for (
            let columnIndex: number = columnStartIndex;
            columnIndex <= columnStopIndex;
            columnIndex++
        ) {
            const type = getType(rowIndex, columnIndex)

            const x = getColumnOffset(rowIndex, columnIndex, map)

            const y = getRowOffset(rowIndex, columnIndex, map)

            const k = rowIndex + ':' + columnIndex

            const width = getColumnWidth(type, k)

            const height = getRowHeight(type, k)

            map[k] = {
                x,
                y,
                width,
                height,
                value: prev[k]?.value || '',
                type: type,
                key: k,
                ownKey: k,
                fill: prev[k]?.fill || getFill(type),
                ismerge: prev[k]?.ismerge || undefined,
                borderStyle: prev[k]?.borderStyle || undefined,
                verticalAlign: prev[k]?.verticalAlign || undefined,
                textColor: prev[k]?.textColor || undefined,
                fontWeight: prev[k]?.fontWeight || undefined,
                align: prev[k]?.align || undefined,
                fontSize: prev[k]?.fontSize || undefined,
                fontFamily: prev[k]?.fontFamily || undefined,
                fontItalic: prev[k]?.fontItalic || undefined,
                textDecoration: prev[k]?.textDecoration || undefined,
            }
        }
    }

    return map
}
