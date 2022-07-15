import React, {
    CSSProperties,
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
import { CellAttrs, CellStoreContext } from '@/stores/CellStore'
import { getCurrentCellByXY } from '@/utils'
import _ from 'lodash'
import { headerCell, leftCell } from '@/utils/constants'

// interface IProps {
//     swidth: number
//     sheight: number
// }

const CornerArea = () => {
    const cellStore = useContext(CellStoreContext)
    const selectArea = cellStore.selectArea
    const activeCell = cellStore.activeCell
    // const setSelectArea = cellStore.setSelectArea
    const getHeaderAreaCell: CSSProperties = useMemo(() => {
        var style: CSSProperties = {}
        if (selectArea) {
            const o = selectArea

            style = {
                left: o.left,
                top: 0,
                width: o.right - o.left,
                height: headerCell.height,
            }

            return style
        } else if (activeCell) {
            const o = activeCell

            style = {
                left: o.x,
                top: 0,
                width: o.width,
                height: headerCell.height,
            }

            return style
        }

        return style
    }, [selectArea, activeCell])

    const getLeftAreaCell: CSSProperties = useMemo(() => {
        var style: CSSProperties = {}

        if (selectArea) {
            const o = selectArea

            style = {
                left: 0,
                top: o.top,
                width: leftCell.width,
                height: o.bottom - o.top,
            }

            return style
        } else if (activeCell) {
            const o = activeCell

            style = {
                left: 0,
                top: o.y,
                width: leftCell.width,
                height: o.height,
            }

            return style
        }
        return style
    }, [selectArea, activeCell])

    const mouseEventStore = useContext(MouseEventStoreContext)

    return (
        <div
            className={'corner-area'}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    ...getHeaderAreaCell,
                    transform: `translate(-${
                        mouseEventStore.scrollLeft + 0
                    }px,0px)`,
                }}
                className={styles['header-area']}
            ></div>
            <div
                style={{
                    ...getLeftAreaCell,
                    transform: `translate(0px,-${
                        mouseEventStore.scrollTop + 0
                    }px)`,
                }}
                className={styles['left-area']}
            ></div>
        </div>
    )
}

export default observer(CornerArea)
