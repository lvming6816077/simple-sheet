import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import { generaCell, getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'

export type CellAttrs = {
    x: number,
    y: number,
    width?:number,
    height?:number,
    value?: string,
    key?:string ,
    type?:string,
    ownKey?:string,
    fill?:string
} | null

export type CellMap = {
    [key:string]:CellAttrs
}



class CellStore {



    @action.bound
    changeWidth(ownKey:string,newwidth:number,newx:number) {
        // let cur = getCurrentCellByOwnKey(ownKey,this._cells)
        // // console.log(newwidth)
        // if (cur) {
        //     // cur!.value = e.target.value
        //     cur.width = newwidth
        // }

        var copy:CellMap = JSON.parse(JSON.stringify(this.cellsMap))



        for (var key in copy) {
            var item = copy[key]
            let lk = item?.ownKey?.split(':')[1]
            
            let rk = ownKey.split(':')[1]
            // console.log(ownKey)
            if (lk == rk) {
                item!.width = newwidth
            }

        }

        this.cellsMap = generaCell(copy)
    }
    @action.bound
    changeHeight(ownKey:string,newheight:number) {

        var copy:CellMap = JSON.parse(JSON.stringify(this.cellsMap))

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
                if (item.x >= left && item.x <=right) {
                    item!.fill = '#e9eaed'
                } else {
                    item!.fill = ''
                }
            }
        }

    }

    @action.bound
    activeLeft(top:number,bottom:number){

        for (var key in this.cellsMap) {
            var item = this.cellsMap[key]
            
            if (item?.type == 'left') {
                
                if (item.y >= top && item.y <=bottom) {
                    item!.fill = '#e9eaed'
                } else {
                    item!.fill = ''
                }
            }
        }

    }

    @observable
    cellsMap:CellMap = generaCell()



    //   @computed
    //   get getcells() {

    //   }

}

export const CellStoreContext = createContext(new CellStore())