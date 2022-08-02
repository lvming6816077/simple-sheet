import {
    CellAttrs,
    CellMap,
    CellStoreContext,
    SelectArea,
} from '@/stores/CellStore'
import _ from 'lodash'
import { useContext } from 'react'

type PrevFunc = {
    getPrevK?: (rowIndex: number, columnIndex: number) => string
    getMerge?: (ov: any, rowIndex: number, columnIndex: number) => any
    getPrevV?: (ov: any, rowIndex: number, columnIndex: number) => any
}

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

export const getCellCopyAttr = (cur?:CellAttrs) =>{
    const o = {
        verticalAlign:cur!.verticalAlign,
        textColor:cur!.textColor,
        textDecoration:cur!.textDecoration,
        value:cur!.value,
        borderStyle:cur!.borderStyle,
        align:cur!.align,
        fill:cur!.fill,
        fontFamily:cur!.fontFamily,
        fontItalic:cur!.fontItalic,
        fontSize:cur!.fontSize,
        fontWeight:cur!.fontWeight,
        imgLoaded:cur!.imgLoaded,
        imgUrl:cur!.imgUrl,
        ownKey:cur!.ownKey

    }

    return o
}

// 二维矩阵cell数据
export const getCurrentCellsRectByArea = (o: SelectArea, cellsMap: CellMap) => {

    let list = getCurrentCellsByArea(o,cellsMap)
    let first = list[0],last = list[list.length-1];

    let firstRow = Number(first!.ownKey.split(':')[0])
    let firstCol = Number(first!.ownKey.split(':')[1])

    let lastRow = Number(last!.ownKey.split(':')[0])

    let lastCol = Number(last!.ownKey.split(':')[1])


    let m = lastRow - firstRow
    let n = lastCol - firstCol
    let arr = []

    for (var i = 0 ; i <= m ; i++) {
        var k = []
        for (var j = 0 ; j <= n ; j++) {

            k.push(getCellCopyAttr(_.find(list,{ownKey:(i+firstRow)+':'+(j+firstCol)})))
        }
        arr.push(k)
    }

    return arr
}

export const getScrollWidthAndHeight = (
    cellsMap: CellMap,
    rowStopIndex: number,
    columnStopIndex: number
) => {
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
            sheight: 0,
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
const checkLeftByKey = (ownKey: string) => {
    var c = Number(ownKey.split(':')[1])

    return c == 0
}
const checkHeaderByKey = (ownKey: string) => {
    var r = Number(ownKey.split(':')[0])

    return r == 0
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
// export const copyToClipboard = (text:string) => {
//     // 创建一个文本域 
//     const textArea = document.createElement('textarea')
//     // 隐藏掉这个文本域，使其在页面上不显示	
//     textArea.style.position = 'fixed'
//     textArea.style.visibility = '-10000px'
//     // 将需要复制的内容赋值给文本域
//     textArea.value = text
//     // 将这个文本域添加到页面上
//     document.body.appendChild(textArea)
//     // 添加聚焦事件，写了可以鼠标选取要复制的内容
//     textArea.focus()
//     // 选取文本域内容
//     textArea.select()
  
//     if (!document.execCommand('copy')) { // 检测浏览器是否支持这个方法
//       console.warn('浏览器不支持 document.execCommand("copy")')
//       // 复制失败将构造的标签 移除
//       document.body.removeChild(textArea)
//       return false
//     } else {
//         console.log("复制成功")
//         // 复制成功后再将构造的标签 移除
//       document.body.removeChild(textArea)
//       return true
//     }
//   }

export const generaCell = (
    prev: CellMap = {},
    rowStopIndex: number,
    columnStopIndex: number,
    prevFunc: PrevFunc = {}
) => {
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

        const cur = prev[k.split(':')[0] + ':0']
        return cur ? cur.height : v
    }

    const getColumnWidth = (type: string, k: string, isFirst?: boolean) => {
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
        if (checkLeftByKey(k) && isFirst) {
            return v
        }

        const cur = prev['0:' + k.split(':')[1]]
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
            return undefined
        }

        return singleCell.fill
    }

    var map: CellMap = {}
    for (let rowIndex: number = 0; rowIndex <= rowStopIndex; rowIndex++) {
        for (
            let columnIndex: number = 0;
            columnIndex <= columnStopIndex;
            columnIndex++
        ) {
            const type = getType(rowIndex, columnIndex)

            const x = getColumnOffset(rowIndex, columnIndex, map)

            const y = getRowOffset(rowIndex, columnIndex, map)

            const ownKey = rowIndex + ':' + columnIndex

            let k = ownKey
            if (prevFunc.getPrevK) {
                k = prevFunc.getPrevK(rowIndex, columnIndex)
            }

            const dealFirst =
                prevFunc.getPrevV && (checkHeaderByKey(k) || checkLeftByKey(k))

            const width = getColumnWidth(type, k, dealFirst)

            const height = getRowHeight(type, k)

            let isMerge = prev[k]?.isMerge || undefined
            if (prevFunc.getMerge) {
                isMerge = prevFunc.getMerge(isMerge, rowIndex, columnIndex)
            }

            // 增加单元格时不需要复制得内容
            let noCopyAttr: any = {
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
                noEdit: prev[k]?.noEdit || undefined,
                value:prev[k]?.value || undefined,
            }

            if (prevFunc.getPrevV) {
                for (var key in noCopyAttr) {
                    noCopyAttr[key] = prevFunc.getPrevV(
                        noCopyAttr[key],
                        rowIndex,
                        columnIndex
                    )
                }
            }

            map[ownKey] = {
                x,
                y,
                width,
                height,
                type: type,
                ownKey: ownKey,
                isMerge: dealFirst ? undefined : isMerge,
                fill: dealFirst
                    ? getFill(type)
                    : prev[k]?.fill || getFill(type),
                borderStyle: dealFirst
                    ? undefined
                    : prev[k]?.borderStyle || undefined,
                ...noCopyAttr,
            }
        }
    }

    return map
}
