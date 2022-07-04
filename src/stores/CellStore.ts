import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import { checkIntervals, generaCell, getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'
import { headerCell, leftCell } from '@/utils/constants'

export type CellAttrs = {
    x: number,
    y: number,
    width:number,
    height:number,
    value?: string,
    key?:string ,
    type?:string,
    ownKey:string,
    fill?:string,
    ismerge?:string[],
    // orix?:number
} | null

export type CellMap = {
    [key:string]:CellAttrs
}

export type SelectArea = {
    left:number,
    top:number,
    bottom:number,
    right:number,
    // width:number,
    // height:number,
    border?:boolean
} | null


export class CellStore {



    @action.bound
    mergeCell(list:CellAttrs[]) {
        // console.log(list[0],list[list.length-1])
        var mergekey:string[] = [list[0]!.ownKey,list[list.length-1]!.ownKey]
        // console.log(mergekey)
        for (var key in this.cellsMap) {
            if (_.find(list,{ownKey:key})) {
                this.cellsMap[key]!.ismerge = mergekey
            } else {
                this.cellsMap[key]!.ismerge = this.cellsMap[key]!.ismerge == undefined ? undefined : this.cellsMap[key]!.ismerge
            }
        }

    }

    // tempx:number = 0

    @action.bound
    changeWidth(ownKey:string,newwidth:number,newx:number) {
        // let cur = getCurrentCellByOwnKey(ownKey,this._cells)
        // // console.log(newwidth)
        // if (cur) {
        //     // cur!.value = e.target.value
        //     cur.width = newwidth
        // }
        // this.tempx = this.activeCell!.x

        var copy:CellMap = this.cellsMap

        var oriwidth = copy[ownKey]!.width
        var orix = copy[ownKey]!.x

        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[1]
            
            let rk = ownKey.split(':')[1]
            // console.log(ownKey)
            if (lk == rk) {
                item!.width = newwidth
            }
        }

        if (this.activeCell) {
            const cur = getCurrentCellByOwnKey(this.activeCell.ownKey,this.cellsMap) // 待优化
            var type = checkIntervals([[this.activeCell.x, this.activeCell.x+this.activeCell.width],[orix,orix+oriwidth]])
            if (type == 'trans') {
                this.setActiveCell({
                    ...this.activeCell,
                    x:cur!.x,
                    
                } as CellAttrs)
            }
            else if (type == 'distance') {
                this.setActiveCell({
                    ...this.activeCell,
                    // x:newx,
                    
                    width: newwidth+(this.activeCell.width-oriwidth),
                } as CellAttrs)
            }

        }

        this.cellsMap = generaCell(copy)
    }
    @action.bound
    changeHeight(ownKey:string,newheight:number) {

        var copy:CellMap = this.cellsMap

        var oriheight = copy[ownKey]!.height

        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[0]
            
            let rk = ownKey.split(':')[0]
            // console.log(ownKey)
            if (lk == rk) {
                item!.height = newheight
            }

        }

        if (this.activeCell) {
            this.setActiveCell({
                ...this.activeCell,
                height: newheight+(this.activeCell.height-oriheight),
            } as CellAttrs)
        }

        this.cellsMap = generaCell(copy)
    }

    @action.bound
    activeHeader(left:number,right:number){

        for (var key in this.cellsMap) {
            var item = this.cellsMap[key]
            
            if (item?.type == 'header') {
                if (item.x >= left && item.x <right) {

                    item!.fill = '#e9eaed'
                } else {
                    item!.fill = headerCell.fill
                }
            }
        }

    }

    @action.bound
    activeLeft(top:number,bottom:number){

        for (var key in this.cellsMap) {
            var item = this.cellsMap[key]
            
            if (item?.type == 'left') {
                
                if (item.y >= top && item.y <bottom) {
                    item!.fill = '#e9eaed'
                } else {
                    item!.fill = leftCell.fill
                }
            }
        }

    }
    @action.bound
    setSelectArea(o:SelectArea){

        this.selectArea = o

    }

    @action.bound
    setActiveCell(o:CellAttrs){
        // if (this.activeCell != null) {
            
        // }
        this.activeCell = o
    }

    

    @observable
    cellsMap:CellMap = generaCell()

    @observable
    selectArea:SelectArea = null


    @observable
    activeCell:CellAttrs = null

    //   @computed
    //   get getcells() {

    //   }

}

export const CellStoreContext = createContext(new CellStore())