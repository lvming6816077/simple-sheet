import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {  generaCell, getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'
import { headerCell, leftCell } from '@/utils/constants'

export type BorderStyle = {
    color?:string,
    strokeDash?:number[],
}
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
    borderStyle?:BorderStyle,
    fontWeight?:string|boolean,
    textColor?:string,
    verticalAlign?:string,
    align?:string,
    fontFamily?:string,
    fontSize?:number,
    fontItalic?:string|boolean,
    textDecoration?:string|boolean
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
        if (list.length < 2) return
        var mergekey:string[] = [list[0]!.ownKey,list[list.length-1]!.ownKey]
        list.forEach((i,index)=>{
            if (index != list.length-1) {
                i!.value = ''
            }
        })
        for (var key in this.cellsMap) {
            if (_.find(list,{ownKey:key})) {
                this.cellsMap[key]!.ismerge = mergekey
            } else {
                this.cellsMap[key]!.ismerge = this.cellsMap[key]!.ismerge == undefined ? undefined : this.cellsMap[key]!.ismerge
            }
        }

    }

    @action.bound
    splitCell(list:CellAttrs[]) {
        // var mergekey:string[] = [list[0]!.ownKey,list[list.length-1]!.ownKey]
        list.forEach((i,index)=>{
            i!.ismerge = undefined
        })
        // for (var key in this.cellsMap) {
        //     if (_.find(list,{ownKey:key})) {
        //         this.cellsMap[key]!.ismerge = mergekey
        //     } else {
        //         this.cellsMap[key]!.ismerge = this.cellsMap[key]!.ismerge == undefined ? undefined : this.cellsMap[key]!.ismerge
        //     }
        // }

    }

    @action.bound
    fillCell(color:string,list:CellAttrs[]) {
        list.forEach((i,index)=>{
            i!.fill = color
        })
    }



    

    @action.bound
    areaHeaderCell(ownKey:string) {

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
            left:list[0].x,
            top:list[0].y,
            bottom:list[list.length-1].y+list[list.length-1].height,
            right:list[0].x+list[0].width,
            border:true
        }
        this.selectStart = getCurrentCellByXY(o.left,o.top,this.cellsMap)
        this.selectEnd = getCurrentCellByXY(o.left,list[list.length-1].y,this.cellsMap)

        this.setSelectArea(o)
        this.setActiveCell(null)
        this.activeHeader(o.left,o.right)

    }
    @action.bound
    areaLeftCell(ownKey:string) {

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
            left:list[0].x,
            top:list[0].y,
            bottom:list[list.length-1].y+list[list.length-1].height,
            right:list[list.length-1].x+list[list.length-1].width,
            border:true
        }

        this.selectStart = getCurrentCellByXY(o.left,o.top,this.cellsMap)
        this.selectEnd = getCurrentCellByXY(list[list.length-1].x,list[list.length-1].y,this.cellsMap)

        this.setSelectArea(o)
        this.setActiveCell(null)
        this.activeLeft(o.top,o.bottom)

    }

    // tempx:number = 0

    @action.bound
    changeWidth(ownKey:string,newwidth:number,newx:number) {


        var copy:CellMap = this.cellsMap



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


        this.cellsMap = generaCell(copy)
    }
    @action.bound
    changeHeight(ownKey:string,newheight:number) {

        var copy:CellMap = this.cellsMap


        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[0]
            
            let rk = ownKey.split(':')[0]
            // console.log(ownKey)
            if (lk == rk) {
                item!.height = newheight
            }

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
        this.activeCell = o
    }


    

    

    @observable
    cellsMap:CellMap = generaCell()

    @observable
    selectArea:SelectArea = null


    @observable
    activeCell:CellAttrs = null

    @observable
    selectStart:CellAttrs = null

    @observable
    selectEnd:CellAttrs = null
    //   @computed
    //   get getcells() {

    //   }

}

export const CellStoreContext = createContext(new CellStore())