import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import { getCurrentCellsByArea, getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'


import { BorderStyle, CellAttrs, CellMap, CellStore, CellStoreContext, SelectArea } from './CellStore'
import { defaultBorderStyle } from '@/utils/constants'


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

    dealWithBorderStyle(obj:BorderStyle,cellStore: CellStore,hide = false){
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(cellStore.selectArea, cellStore.cellsMap)
            cells.forEach(i=>{
                i!.borderStyle = hide ? undefined : {
                    ...i!.borderStyle,
                    ...obj
                }
            })
        } else if (cellStore.activeCell){
            let cell = getCurrentCellByOwnKey(cellStore.activeCell.ownKey, cellStore.cellsMap)
            cell!.borderStyle = hide ? undefined :{
                ...cell!.borderStyle,
                ...obj
            }
        }
    }

    @action.bound
    colorBorderCell(color:string,cellStore: CellStore) {
        this.dealWithBorderStyle({color:color,strokeDash:this.currentBorderStyle?.strokeDash},cellStore)
        this.currentBorderStyle = {
            ...this.currentBorderStyle,
            color:color
        }
    }
    @action.bound
    dashBorderCell(dash:number[],cellStore: CellStore){

        this.dealWithBorderStyle({strokeDash:dash,color:this.currentBorderStyle?.color},cellStore)
        this.currentBorderStyle = {
            ...this.currentBorderStyle,
            strokeDash:dash
        }
    }

    @observable
    currentBorderStyle:BorderStyle = defaultBorderStyle


    @action.bound
    toggleBorderCell(flag:boolean,cellStore: CellStore){

        this.dealWithBorderStyle(this.currentBorderStyle,cellStore,!flag)

        if (flag == false) {
            this.currentBorderStyle = defaultBorderStyle
        }
    }

    //   @computed
    //   get getcells() {

    //   }

}

export const ToolBarStoreContext = createContext(new ToolBarStore())