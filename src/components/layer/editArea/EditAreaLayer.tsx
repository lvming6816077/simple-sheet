import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import styles from './styles.module.css'
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from '@/stores/CellStore'

import _ from 'lodash'
import {
    headerCell,
    leftCell,
    normalCell,
    singleCell,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
} from '@/utils/constants'
import { getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils/index'

interface IProps {}

const EditAreaLayer = (props: any) => {
    const mouseEventStore = useContext(MouseEventStoreContext)
    const dbc = mouseEventStore.dbcCellAttr

    const cellStore = useContext(CellStoreContext)

    const [editCell, setEditCell] = useState<CellAttrs>(null)

    useEffect(() => {

        if (!dbc || !dbc.ownKey || dbc.noEdit) return
        var cur = getCurrentCellByOwnKey(dbc!.ownKey, cellStore.cellsMap, true)

        if (cur?.isMerge) {
            setEditCell({
                ...cur,
                ownKey: cellStore.cellsMap[cur.isMerge[1]]!.ownKey,
                value: cellStore.cellsMap[cur.isMerge[1]]?.value,
            })
            return
        }

        setEditCell(dbc)
    }, [dbc])

    // useEffect(() => {
    //     setEditCell(null)
    // }, [mouseEventStore.downCellAttr])



    const editCellRenderer = (o: any) => {
        const style: CSSProperties = {
            position: 'absolute',
            left: o.x,
            top: o.y,
            borderWidth: o.strokeWidth,
            borderColor: o.stroke,
            width: o.width + 1,
            height: o.height + 1,
            borderStyle: 'solid',
            boxSizing: 'border-box',
            boxShadow: 'rgb(60 64 67 / 15%) 0px 2px 6px 2px',
            backgroundColor: '#fff',
        }

        return (
            <div style={style}>
                <textarea
                    defaultValue={o.value}
                    className={styles['edit-textarea']}
                    autoFocus
                    onFocus={(e)=>{
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onInput={(e:any) => {
                        e.target.style.height = e.target.scrollHeight + 'px';

                    }}
                    onBlur={(e) => {
                        let cur = getCurrentCellByOwnKey(
                            o.ownKey,
                            cellStore.cellsMap
                        )
                        if (cur) {
                            cur.value = e.target.value
                        }
                        setEditCell(null)
                        // let height = Math.max(Number(e.target.style.height.replace('px','')),normalCell.height)
                        // cellStore.changeHeight(dbc!.ownKey,height)
                    }}
                ></textarea>
            </div>
        )
    }

    const getEditCellSelection = useCallback(() => {
        if (!editCell) return null

        // console.log(editCell)

        const cell = editCellRenderer({
            stroke: '#1a73e8',
            strokeWidth: 2,
            fill: 'transparent',
            x: editCell.x,
            y: editCell.y,
            width: editCell.width,
            height: editCell.height,
            value: editCell.value,
            ownKey: editCell.ownKey,
        })

        return cell
    }, [editCell])

    return (
        <div
            style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: -leftCell.width,
                top: -headerCell.height,
                right: 0,
                bottom: 0,
                zIndex: 3,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    transform: `translate(-${
                        mouseEventStore.scrollLeft + 0
                    }px, -${mouseEventStore.scrollTop + 0}px)`,
                }}
            >
                {getEditCellSelection()}
            </div>
        </div>
    )
}

export default observer(EditAreaLayer)
