import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";


import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from "@/stores/CellStore";
import { getCurrentCellByOwnKey, getCurrentCellByXY } from "@/utils";
import _ from 'lodash'

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

const SelectAreaLayer = (props: any) => {


    const isSelecting = useRef(false);
    const selectStart = useRef<CellAttrs>(null);
    const [selectEnd, setSelectEnd] = useState<CellAttrs>(null);



    const cellStore = useContext(CellStoreContext)

    const selectArea = cellStore.selectArea
    const setSelectArea = cellStore.setSelectArea



    const selectAreaRenderer = (o: any) => {
        const style: CSSProperties = {
            position: 'absolute',
            left: o.left,
            top: o.top,
            width: o.right-o.left,
            height: o.bottom-o.top,
            border: ''

        }

        if (o.border) {
            style.border = '1px solid rgb(26, 115, 232)'
        } else {
            style.border = 'none'
        }


        return (

            <div style={style} className={styles['select-area']}>
            </div>
        )
    }


    const getSelectAreaCell = useCallback(() => {
        if (!selectArea) return null

        const o = selectArea

        if (selectEnd) {
            o.border = true
        } else {
            o.border = false
        }

        const cell = selectAreaRenderer(o);


        return cell

    }, [selectArea, selectEnd])

    const [activeCell,setActiveCell] = useState<CellAttrs>(null)

    // const activeCell = cellStore.activeCell
    // const setActiveCell = cellStore.setActiveCell



    const activeCellRenderer = (o: any) => {

        const style: CSSProperties = {
            position: 'absolute',
            left: o.x,
            top: o.y,
            borderWidth: o.strokeWidth,
            borderColor: o.stroke,
            width: o.width + 1,
            height: o.height + 1,
            borderStyle: 'solid',
            boxSizing: 'border-box'

        }
        return <div style={style}></div>
    }

    const getActiveCellSelection = useCallback(() => {

        if (!activeCell) return null
        

        const cell = activeCellRenderer({
            stroke: "#1a73e8",
            strokeWidth: 2,
            fill: "transparent",
            x: activeCell.x,
            y: activeCell.y,
            width: activeCell?.width,
            height: activeCell?.height,
        });

        return cell

    }, [activeCell])

    // const c = getCurrentCellByOwnKey('4:5', cellStore.cellsMap)




    const mouseEventStore = useContext(MouseEventStoreContext)
    const dv = mouseEventStore.downCellAttr
    const uv = mouseEventStore.upCellAttr
    const mv = mouseEventStore.moveCellAttr

    // const cellsMap = cellStore.cellsMap

    useEffect(() => {
        

        if (dv?.type == 'header' || dv?.type == 'left')  {
            if (activeCell) {
                isSelecting.current = true
                let cur = getCurrentCellByOwnKey(activeCell?.ownKey || '', cellStore.cellsMap)
                setActiveCell(cur)
            }
        } else {

            let cur = getCurrentCellByOwnKey(dv?.ownKey || '', cellStore.cellsMap)
    
            setActiveCell(cur)
            setSelectArea(null)
            isSelecting.current = true
            setSelectEnd(null)
            selectStart.current = cur ? {
                ...cur,
                x: cur.x,
                y: cur.y,
            } : null
    
    
    
            cur && cellStore.activeHeader(cur!.x, cur!.x+cur!.width)
            cur && cellStore.activeLeft(cur!.y, cur!.y+cur.height)
        }


    }, [dv,cellStore.cellsMap])

    useEffect(() => {
        let cur = getCurrentCellByOwnKey(mv?.ownKey || '', cellStore.cellsMap)
        if (mv?.type == 'header' || mv?.type == 'left')  {

            if (selectEnd) {
                cur = getCurrentCellByOwnKey(selectEnd?.ownKey || '', cellStore.cellsMap)
                
            }
        }
        
        // console.log(cur)
        if (isSelecting.current && cur) {

            // console.log(cur)
            const start = selectStart.current

            if (start == null) return

            if (cur.x == start.x && cur.y == start.y) {
                setSelectArea(null)
                return
            }

            let top = Math.min(start.y, cur.y);
            let bottom = Math.max(start.y+start.height, cur.y+cur.height);
            let left = Math.min(start.x, cur.x);
            let right = Math.max(start.x+start.width, cur.x+cur.width);

            

            const o = { top, bottom, left, right }



            cellStore.activeHeader(left, right)
            cellStore.activeLeft(top, bottom)

            setSelectArea(o)
        }
    }, [cellStore.cellsMap,mv])






    useEffect(() => {

        if (!uv?.ownKey && isSelecting.current)  {
            // setSelectEnd(null)
            isSelecting.current = false
            return
        }
        console.log(uv)
        if (isSelecting.current && uv) {
            isSelecting.current = false

            setSelectEnd({
                x: uv.x,
                y: uv.y,
                ownKey:uv.ownKey,
                width: uv.width,
                height: uv.height
            })
        }
    }, [uv])


    return (

        <div
            style={{
                pointerEvents: "none",
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    transform: `translate(-${mouseEventStore.scrollLeft + 0}px, -${mouseEventStore.scrollTop + 0
                        }px)`,
                }}
            >
                {activeCell?.width}
                {getSelectAreaCell()}
                {getActiveCellSelection()}
            </div>
        </div>
    )
};

export default observer(SelectAreaLayer);
