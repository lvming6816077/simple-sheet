import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {
    getCurrentCellsByArea,
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCellsByMergeKey,
} from '@/utils'

import {
    BorderStyle,
    CellAttrs,
    CellMap,
    CellStore,
    CellStoreContext,
    SelectArea,
} from './CellStore'
import { defaultBorderStyle } from '@/utils/constants'

export type FloatImage = {
    id:string,
    width:number,
    height:number,
    x:number,
    y:number,
    transformObj:TransformObj|null
    imgUrl:string
}

export type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type TransformObj  = {} & Pick<FloatImage, 'x' | 'y'|'width'|'height'>

class FloatImageStore {


    @observable
    currentTransformerId:string = ''



    @observable
    floatImage: FloatImage[] = []

    @action.bound
    addFloatImage(o:FloatImage) {
        // this.floatImage.push(o)
        this.currentTransformerId = o.id
        this.floatImage = [...this.floatImage,o]
        // console.log(this.floatImage)
    }

    @action.bound
    changeFloatImage(o:FloatImage) {
        const index = _.findIndex(this.floatImage,{id:o.id})
        this.floatImage[index] = o
        // this.floatImage = [...this.floatImage,o]
        // console.log(this.floatImage)
    }



}

export const FloatImageStoreContext = createContext(new FloatImageStore())
