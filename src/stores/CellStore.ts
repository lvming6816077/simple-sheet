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
} | null



class CellStore {



    @action.bound
    changeWidth(ownKey:string,newwidth:number) {
        // let cur = getCurrentCellByOwnKey(ownKey,this.cells)
        // console.log(newwidth)
        // if (cur) {
        //     // cur!.value = e.target.value
        //     cur.width = newwidth
        // }

        this.cells.forEach(item=>{
            let lk = item?.ownKey?.split(':')[1]
            let rk = ownKey.split(':')[1]
            // console.log(newwidth)
            if (lk == rk) {
                item!.width = newwidth
            }
        })

        this.cells = generaCell(this.cells)
    }
    @action.bound
    changeHeight(ownKey:string,newheight:number) {
        this.cells.forEach(item=>{
            let lk = item?.ownKey?.split(':')[0]
            let rk = ownKey.split(':')[0]
            // console.log(newwidth)
            if (lk == rk) {
                item!.height = newheight
            }
        })

        this.cells = generaCell(this.cells)
    }



      @observable
      cells:CellAttrs[] = generaCell()

    //   @computed
    //   get getcells() {

    //   }
}

export const CellStoreContext = createContext(new CellStore())