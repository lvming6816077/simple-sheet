import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";


import {  MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from "@/stores/CellStore";

import _ from 'lodash'

import {getCurrentCellByXY} from '@/utils/index'

interface IProps {
    src: string[];
    currentIndex?: number;
    backgroundStyle?: CSSProperties;
    disableScroll?: boolean;
    closeOnClickOutside?: boolean;
    onClose?: () => void;
    closeComponent?: JSX.Element;
    leftArrowComponent?: JSX.Element;
    rightArrowComponent?: JSX.Element;
}

const EditAreaLayer = (props: any) => {

    const scrollLeft = 0
    const scrollTop = 0



    const mouseEventStore = useContext(MouseEventStoreContext)
    const dbc = mouseEventStore.dbcCellAttr
    

    const cellStore = useContext(CellStoreContext)




    // const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex,cellHeight, cellWidth} = cellStore


    const [editCell, setEditCell] = useState<CellAttrs>(null)

    useEffect(() => {
        setEditCell(dbc)
    }, [dbc])

    useEffect(() => {
        setEditCell(null)
    }, [mouseEventStore.downCellAttr])


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
            backgroundColor: '#fff'
        }




        return (

            <div style={style}>
                <textarea defaultValue={o.value} className={styles['edit-textarea']} autoFocus onBlur={(e) => {
                    let cur = getCurrentCellByXY(o.x,o.y,cellStore.cellsMap)
                    if (cur) {
                        cur!.value = e.target.value
                        // cur.height = 50
                    }
                }}></textarea>
            </div>
        )
    }

    const getEditCellSelection = useCallback(() => {
        if (!editCell) return null

        const cell = editCellRenderer({
            stroke: "#1a73e8",
            strokeWidth: 2,
            fill: "transparent",
            x: editCell.x,
            y: editCell.y,
            width: editCell.width,
            height: editCell.height,
            value:editCell.value
        });


        return cell

    }, [editCell])



    return (

            <div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        transform: `translate(-${mouseEventStore.scrollLeft + 0}px, -${mouseEventStore.scrollTop + 0
                            }px)`,
                    }}
                >
                    {getEditCellSelection()}
                </div>
            </div>
    )
};

export default observer(EditAreaLayer);
