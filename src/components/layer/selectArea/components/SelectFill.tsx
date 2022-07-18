import React, {
    CSSProperties,
    startTransition,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import styles from './styles.module.css'
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext, SelectArea } from '@/stores/CellStore'

import {
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCurrentCellsByArea,
    getScrollWidthAndHeight,
} from '@/utils'
import _ from 'lodash'
import {
    containerHeight,
    containerWidth,
    headerCell,
    leftCell,
    normalCell,
} from '@/utils/constants'

interface IProps {}

const SelectFill = (props: any) => {

    const cellStore = useContext(CellStoreContext)

    const selectFillArea = cellStore.selectFillArea
    const setSelectFillArea = cellStore.setSelectFillArea

    const getSelectFillCell: CSSProperties = useMemo(() => {
        var style: CSSProperties = {
            position: 'absolute',
        }
        if (!selectFillArea) return style

        const o = selectFillArea

        style = {
            position: 'absolute',
            left: o.left,
            top: o.top,
            width: o.right - o.left,
            height: o.bottom - o.top,
        }

        return style
    }, [selectFillArea])




    const mouseEventStore = useContext(MouseEventStoreContext)
    const dv = mouseEventStore.downCellAttr
    const uv = mouseEventStore.upCellAttr
    const mv = mouseEventStore.moveCellAttr

    // const cellsMap = cellStore.cellsMap

    let { swidth, sheight } = useMemo(
        () => getScrollWidthAndHeight(cellStore.cellsMap),
        [cellStore.cellsMap]
    )





    useEffect(() => {

        if (mouseEventStore.selectFilling) {


            let cur = mv
            if (!cur) return

            const start = cellStore.activeCell

            if (start == null) return

            // 回到起点，置为空
            if (cur.x == start.x && cur.y == start.y) {
                setSelectFillArea(null)
                return
            }

            if (cur.y != start.y) {
                let top = Math.min(start.y, cur.y)
                let bottom = Math.max(start.y + start.height, cur.y + cur.height)
                let left = start.x
                let right = start.x + start.width
                const o = { top, bottom, left, right }
                setSelectFillArea(o)
            }

            if (cur.x != start.x) {
                let top = start.y
                let bottom = start.y+start.height
                let left = Math.min(start.x, cur.x)
                let right = Math.max(start.x + start.width, cur.x + cur.width)
                const o = { top, bottom, left, right }
                setSelectFillArea(o)
            }

        }
    }, [mv])

    useEffect(()=>{
        
        if (selectFillArea) {
            cellStore.setSelectFillAreaCell(selectFillArea,cellStore.activeCell)
            setSelectFillArea(null)
        }
        mouseEventStore.selectFilling = false
        
    },[uv])



    return (
        <div
            style={getSelectFillCell}
            className={styles['select-fill-area']}
        ></div>
    )
}

export default observer(SelectFill)
