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
import SelectFill from './components/SelectFill'
import { FloatImageStoreContext } from '@/stores/FloatImageStore'
import { ToolBarStoreContext } from '@/stores/ToolBarStore'

interface IProps {}

const SelectAreaLayer = (props: any) => {
    const isSelecting = useRef(false)

    const cellStore = useContext(CellStoreContext)
    const toolbarStore = useContext(ToolBarStoreContext)
    const floatImageStore = useContext(FloatImageStoreContext)

    const selectArea = cellStore.selectArea
    const setSelectArea = cellStore.setSelectArea

    const getSelectAreaCell: CSSProperties = useMemo(() => {
        var style: CSSProperties = {
            position: 'absolute',
        }
        if (!selectArea) return style

        const o = selectArea

        style = {
            position: 'absolute',
            left: o.left,
            top: o.top,
            width: o.right - o.left,
            height: o.bottom - o.top,
        }

        return style
    }, [selectArea])

    const activeCell = cellStore.activeCell
    const setActiveCell = cellStore.setActiveCell

    const getActiveCellSelection = useMemo(() => {
        if (!activeCell) return undefined

        const style: CSSProperties = {
            left: activeCell.x,
            top: activeCell.y,
            width: activeCell?.width + 1,
            height: activeCell?.height + 1,
            // backgroundColor:selectArea?'#fff':'transparent'
        }

        return style
    }, [activeCell])

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
        if (activeCell) {
            let cur = getCurrentCellByOwnKey(
                activeCell?.ownKey || '',
                cellStore.cellsMap,
                true
            )
            setActiveCell(cur)
        }
        if (selectArea) {
            var first = getCurrentCellByOwnKey(
                cellStore.selectStart!.ownKey,
                cellStore.cellsMap,
                true
            )
            var last = getCurrentCellByOwnKey(
                cellStore.selectEnd!.ownKey,
                cellStore.cellsMap,
                true
            )
            // console.log(first,last)
            const o = {
                top: first!.y,
                bottom: last!.y + last!.height,
                left: first!.x,
                right: last!.x + last!.width,
            }

            setSelectArea(o)
        }

        // let arr = _.values(cellStore.cellsMap)
        // arr.filter(i=>{
        //     if (i?.isMerge) {
        //         if(i.isMerge[0] == i.ownKey){
        //             console.log(i.ownKey)
        //         }
        //     }
        // })
    }, [cellStore.cellsMap])

    const expandScrollArea = (cur: CellAttrs) => {
        if (!cur) return
        var isRightBound =
            cur.x + cur.width - mouseEventStore.scrollLeft >=
            containerWidth - 20
        var isLeftBound = cur.x - mouseEventStore.scrollLeft <= leftCell.width
        var isBottomBound =
            cur.y + cur.height - mouseEventStore.scrollTop >=
            containerHeight - 20

        var isTopBound = cur.y - mouseEventStore.scrollTop <= headerCell.height

        if (isRightBound) {
            mouseEventStore.scrollLeft = Math.min(
                swidth - containerWidth,
                mouseEventStore.scrollLeft + cur.width
            )
        } else if (isLeftBound) {
            mouseEventStore.scrollLeft = Math.max(
                0,
                mouseEventStore.scrollLeft - cur.width
            )
        } else if (isBottomBound) {
            mouseEventStore.scrollTop = Math.min(
                sheight - containerHeight,
                mouseEventStore.scrollTop + cur.height
            )
        } else if (isTopBound) {
            mouseEventStore.scrollTop = Math.max(
                0,
                mouseEventStore.scrollTop - cur.height
            )
        }
    }

    const timer = useRef<number>(0)
    const expandScrollAreaCheck = (flag: string, cur: CellAttrs) => {
        if (flag == 'start') {
            if (timer.current) {
                clearInterval(timer.current)
            }
            timer.current = window.setInterval(() => {
                expandScrollArea(cur)
            }, 300)
        } else {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }
    }

    useEffect(() => {
        floatImageStore.currentTransformerId = ''

        if (dv?.type != 'normal') return

        let cur = getCurrentCellByOwnKey(
            dv?.ownKey || '',
            cellStore.cellsMap,
            true
        )

        setActiveCell(cur)
        setSelectArea(null)
        isSelecting.current = true
        cellStore.selectEnd = null
        cellStore.selectStart = cur
            ? {
                  ...cur,
                  x: cur.x,
                  y: cur.y,
              }
            : null
    }, [dv])

    useEffect(() => {
        if (isSelecting.current && !mouseEventStore.selectFilling) {
            // let cur = getCurrentCellByOwnKey(
            //     mv?.ownKey || '',
            //     cellStore.cellsMap,
            //     true
            // )
            let cur = mv
            if (!cur) return

            const start = cellStore.selectStart

            if (start == null) return

            // 回到起点，置为空
            if (cur.x == start.x && cur.y == start.y) {
                setSelectArea(null)
                return
            }

            let top = Math.min(start.y, cur.y)
            let bottom = Math.max(start.y + start.height, cur.y + cur.height)
            let left = Math.min(start.x, cur.x)
            let right = Math.max(start.x + start.width, cur.x + cur.width)

            const o = { top, bottom, left, right }

            // 判断是否覆盖了mergecell
            let arr = getCurrentCellsByArea(o, cellStore.cellsMap).filter(
                (i) => i?.isMerge
            )

            arr.forEach((item) => {
                var cur = getCurrentCellByOwnKey(
                    item!.ownKey,
                    cellStore.cellsMap,
                    true
                )
                o.top = Math.min(o.top, cur!.y)
                o.bottom = Math.max(o.bottom, cur!.y + cur!.height)
                o.left = Math.min(o.left, cur!.x)
                o.right = Math.max(o.right, cur!.x + cur!.width)
            })

            expandScrollAreaCheck('start', cur)
            // expandScrollArea(cur)

            setSelectArea(o)
        }
    }, [mv])

    useEffect(() => {
        if (isSelecting.current && uv) {
            isSelecting.current = false

            cellStore.selectEnd = {
                ...uv,
            }
        }
        expandScrollAreaCheck('stop', null)
    }, [uv])

    return (
        <div
            style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: -leftCell.width,
                top: -headerCell.height,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    // willChange:'transform',
                    transform: `translate3d(-${
                        mouseEventStore.scrollLeft + 0
                    }px, -${mouseEventStore.scrollTop + 0}px,1px)`,
                }}
            >
                {selectArea ? (
                    <div
                        style={getSelectAreaCell}
                        className={styles['select-area']}
                    ></div>
                ) : null}

                <SelectFill></SelectFill>

                <div
                    style={getActiveCellSelection}
                    className={styles['active-cell']}
                >
                    {activeCell?.imgUrl ? <div className={styles['img-icon']} onClick={()=>toolbarStore.currentBigImg = [{ src: activeCell?.imgUrl, alt: '' }] as any}></div> : null}
                    <div
                        className={styles['active-cell-corner']}
                        onMouseDown={() =>
                            (mouseEventStore.selectFilling = true)
                        }
                        onMouseUp={() =>
                            (mouseEventStore.selectFilling = false)
                        }
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default observer(SelectAreaLayer)
