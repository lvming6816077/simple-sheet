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
import { CopyCurrentArea, CopyStoreContext } from '@/stores/CopyStore'

interface IProps {}

export type CopyAreaStrye = {
    viewBox?: string
} & CSSProperties

const CopyArea = (props: any) => {
    const cellStore = useContext(CellStoreContext)
    const copyStore = useContext(CopyStoreContext)

    const getCopyArea: JSX.Element = useMemo(() => {
        if (!copyStore.currentCopyArea) return <></>

        const o = copyStore.currentCopyArea

        const width = o.right - o.left
        const height = o.bottom - o.top

        var style = {
            left: o.left,
            top: o.top,
            width: width,
            height: height,
            viewBox: '0 0 ' + width / 2 + ' ' + height / 2,
        }

        const d = `m0,0 v${height / 2} h${width / 2} v-${height / 2} h-${
            width / 2
        }  z`
        return (
            <>
                <svg
                    className={styles['copy-area']}
                    width={style.width + 'px'}
                    height={style.height + 'px'}
                    viewBox={style.viewBox}
                    style={{ left: style.left, top: style.top }}
                >
                    <path
                        stroke="#fff"
                        strokeWidth="1"
                        fill="none"
                        d={d}
                    ></path>
                    <path
                        className={'dash-animation'}
                        stroke="rgb(26, 115, 232)"
                        strokeWidth="1"
                        fill="none"
                        strokeDashoffset="12"
                        strokeDasharray="3"
                        d={d}
                    ></path>
                </svg>
            </>
        )
    }, [copyStore.currentCopyArea])

    useEffect(() => {
        if (copyStore.currentCopyArea) {
            var list = getCurrentCellsByArea(copyStore.currentCopyArea,cellStore.cellsMap)
            var first = list[0]
            var last = list[list.length-1]
            // console.log(first,last)
            const o = {
                top: first!.y,
                bottom: last!.y + last!.height,
                left: first!.x,
                right: last!.x + last!.width,
            }

            copyStore.currentCopyArea = o

        }
    }, [cellStore.cellsMap])

    const mouseEventStore = useContext(MouseEventStoreContext)
    const dbc = mouseEventStore.dbcCellAttr
    useEffect(() => {
        if (!dbc || !dbc.ownKey || dbc.noEdit) return

        copyStore.currentCopyArea = null
    }, [dbc])

    return <>{getCopyArea}</>
}

export default observer(CopyArea)
