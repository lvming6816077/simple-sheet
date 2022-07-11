import { BorderStyle, CellAttrs, CellMap, CellStoreContext } from "@/stores/CellStore"
import _ from 'lodash'
import { useContext } from "react"



export const headerCell = {
    fill:'#f8f9fa',
    width:130,
    height:30
}

export const leftCell = {
    fill:'#f8f9fa',
    width:60,
    height:30
}

export const normalCell = {
    fill:'#fff',
    width:130,
    height:30,
    fontSize:12,
    fontFamily:'Arial'
}
export const singleCell = {
    fill:'#fff',
    width:60,
    height:30
}

export const rowStartIndex: number = 0
    

export const rowStopIndex: number = 40


export const columnStartIndex: number = 0


export const  columnStopIndex: number = 26

export const cellDash:{
    [key :string]:number[]
} = {
    'solid':[],
    'dashed':[5,5],
    'dotted':[2,2]
}

export const defaultBorderStyle:BorderStyle = {
    color:'#000',
    strokeDash:[]
}

