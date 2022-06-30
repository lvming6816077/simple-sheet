import { CellAttrs, CellStoreContext } from "@/stores/CellStore"
import _ from 'lodash'
import { useContext } from "react"

export const getCurrentCellByXY = (x: number, y: number, cells: CellAttrs[]) => {
    // cells
    return cells[_.findIndex<CellAttrs>(cells, {
        x: x-0.5,
        y: y-0.5
    })]
}

export const getCurrentCellByOwnKey = (key:string, cells: CellAttrs[]) => {
    // cells
    return cells[_.findIndex<CellAttrs>(cells, {
        ownKey:key
    })]
}


export const generaCell = (prev:CellAttrs[] = [])=>{

    // const cellStore = useContext(CellStoreContext)

    // const cells = cellStore.cells

    // console.log(cells)

    const getRowOffset = (rowIndex:number,columnIndex:number,arr:CellAttrs[]) => {


        const cur = _.find(arr,{
            ownKey:(rowIndex-1)+':'+(columnIndex)
        })
    
        return cur ? (cur.y + (cur.height||0)) : 0
    }
    const getColumnOffset = (rowIndex:number,columnIndex:number,arr:CellAttrs[]) => {
    
        const cur = _.find(arr,{
            ownKey:(rowIndex)+':'+(columnIndex-1)
        })
    
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
        const cur = _.find(prev,{
            ownKey:k
        })
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
        const cur = _.find(prev,{
            ownKey:k
        })
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

    var count = 0,arr = []
    for (let rowIndex: number = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {

        for (let columnIndex: number = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            
            
            const x = getColumnOffset(rowIndex,columnIndex,arr);

            const y = getRowOffset(rowIndex,columnIndex,arr);

            const k = rowIndex + ':' + columnIndex

            const type = getType(rowIndex,columnIndex)

            const width = getColumnWidth(type,k)

            const height = getRowHeight(type,k)


            arr.push(
                {
                    x,
                    y,
                    width,
                    height,
                    value: rowIndex + ':' + columnIndex + ':' + count++,
                    type:type,
                    key: k,
                    ownKey:k,
                }
            );

        }
    }

    return arr
}
