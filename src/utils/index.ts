import { CellAttrs, CellMap, CellStoreContext } from "@/stores/CellStore"
import _ from 'lodash'
import { useContext } from "react"

export const getCurrentCellByXY = (x: number, y: number, cellsMap: CellMap) => {
    var _cells = _.values(cellsMap)
    return _cells[_.findIndex<CellAttrs>(_cells, {
        x: x,
        y: y
    })]
}

export const getCurrentCellByOwnKey = (key:string, cellsMap: CellMap) => {

    return cellsMap[key]
}


export const generaCell = (prev:CellMap = {})=>{


    const getRowOffset = (rowIndex:number,columnIndex:number,map:CellMap) => {

        const _ownKey = (rowIndex-1)+':'+(columnIndex)
        const cur = map[_ownKey]
    
        return cur ? (cur.y + (cur.height||0)) : 0
    }
    const getColumnOffset = (rowIndex:number,columnIndex:number,map:CellMap) => {

        const _ownKey = (rowIndex)+':'+(columnIndex-1)

        const cur = map[_ownKey]
    
        return cur ? (cur.x + (cur.width||0)) : 0
    }
    
    const getRowHeight = (type:string,k:string) => {
        let v = 0
        if (type == 'header') {
            v = 20
        }
        
        else if (type == 'left') {
            v = 20
        }
    
        else if (type == 'single') {
            v  = 20
        } else {

            v = cellHeight
        }

        const cur = prev[k]
        return cur ? cur.height : v

    }
    
    const getColumnWidth = (type:string,k:string) => {
        let v = 0
        if (type == 'header') {
            v = 100
        }
        
        else if (type == 'left') {
            v = 60
        }
    
        else if (type == 'single') {
            v  = 60
        } else {

            v = cellWidth
        }

        const cur = prev[k]
        return cur ? cur.width : v

    }
    
    const getType = (rowIndex:number,columnIndex:number) => {
        if (rowIndex == 0 && columnIndex == 0) return 'single'
        if (rowIndex == 0) return 'header'
        if (columnIndex == 0) return 'left'
        return 'normal'
    }


    const rowStartIndex: number = 0
    

    const rowStopIndex: number = 30
    

    const columnStartIndex: number = 0
    

    const  columnStopIndex: number = 8


    const cellHeight: number = 20
    

    const cellWidth: number = 100

    var count = 0
    var map:CellMap = {}
    for (let rowIndex: number = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {

        for (let columnIndex: number = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            
            const type = getType(rowIndex,columnIndex)

            const x = getColumnOffset(rowIndex,columnIndex,map);

            const y = getRowOffset(rowIndex,columnIndex,map);

            const k = rowIndex + ':' + columnIndex



            const width = getColumnWidth(type,k)

            const height = getRowHeight(type,k)

            map[k] = {
                x,
                y,
                width,
                height,
                value: rowIndex + ':' + columnIndex + ':' + count++,
                type:type,
                key: k,
                ownKey:k,
            }


        }
    }

    return map
}
