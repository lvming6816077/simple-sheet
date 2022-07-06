import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";


import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext, SelectArea } from "@/stores/CellStore";
import { getCurrentCellByOwnKey, getCurrentCellByXY, getCurrentCellsByArea } from "@/utils";
import _ from 'lodash'
import { headerCell, leftCell } from "@/utils/constants";

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
            border: '1px solid rgb(26, 115, 232)'

        }

        // if (o.border) {
        //     style.border = '1px solid rgb(26, 115, 232)'
        // } else {
        //     style.border = 'none'
        // }


        return (

            <div style={style} className={styles['select-area']}>
            </div>
        )
    }


    const getSelectAreaCell = useCallback(() => {
        if (!selectArea) return null

        const o = selectArea

        const cell = selectAreaRenderer(o);


        return cell

    }, [selectArea, cellStore.selectEnd])

    // const [activeCell,setActiveCell] = useState<CellAttrs>(null)

    const activeCell = cellStore.activeCell
    const setActiveCell = cellStore.setActiveCell



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





    const mouseEventStore = useContext(MouseEventStoreContext)
    const dv = mouseEventStore.downCellAttr
    const uv = mouseEventStore.upCellAttr
    const mv = mouseEventStore.moveCellAttr

    // const cellsMap = cellStore.cellsMap

    useEffect(()=>{
        if (activeCell) {
            let cur = getCurrentCellByOwnKey(activeCell?.ownKey || '', cellStore.cellsMap,true)
            setActiveCell(cur)
        }
        if (selectArea) {

            var first = getCurrentCellByOwnKey(cellStore.selectStart!.ownKey,cellStore.cellsMap,true)
            var last = getCurrentCellByOwnKey(cellStore.selectEnd!.ownKey,cellStore.cellsMap,true)
            // console.log(first,last)
            const o = { top:first!.y, bottom:last!.y+last!.height, left:first!.x, right:last!.x+last!.width }

            
            setSelectArea(o)
        }

        // let arr = _.values(cellStore.cellsMap)
        // arr.filter(i=>{
        //     if (i?.ismerge) {
        //         if(i.ismerge[0] == i.ownKey){
        //             console.log(i.ownKey)
        //         }
        //     }
        // })
    },[cellStore.cellsMap])

    useEffect(() => {

        // console.log(dv)
        let cur = null;

        if (dv?.type != 'normal' ) return 

        

        cur = getCurrentCellByOwnKey(dv?.ownKey || '', cellStore.cellsMap,true)

        // console.log(cur)
    
        setActiveCell(cur)
        setSelectArea(null)
        isSelecting.current = true
        cellStore.selectEnd = null
        cellStore.selectStart = cur ? {
            ...cur,
            x: cur.x,
            y: cur.y,
        } : null

    
        cur && cellStore.activeHeader(cur!.x, cur!.x+cur!.width)
        cur && cellStore.activeLeft(cur!.y, cur!.y+cur.height)


    }, [dv])

    useEffect(() => {
        let cur = getCurrentCellByOwnKey(mv?.ownKey || '', cellStore.cellsMap,true)
        
        
        // if (mv?.type == 'header' || mv?.type == 'left')  {
        //     if (selectArea) {
        //         let arr = getCurrentCellsByArea(selectArea,cellStore.cellsMap)
        //         cur = arr[arr.length-1]
        //     }
        // }
        
        // console.log(cur)
        if (isSelecting.current && cur) {

            // console.log(cur)
            const start = cellStore.selectStart

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

            // 判断是否覆盖了mergecell
            let arr = getCurrentCellsByArea(o,cellStore.cellsMap).filter(i=>i?.ismerge)

            arr.forEach(item=>{
                var cur = getCurrentCellByOwnKey(item!.ownKey,cellStore.cellsMap,true)
                o.top = Math.min(o.top,cur!.y)
                o.bottom = Math.max(o.bottom,cur!.y+cur!.height)
                o.left = Math.min(o.left,cur!.x)
                o.right = Math.max(o.right,cur!.x+cur!.width)
            })

            cellStore.activeHeader(o.left, o.right)
            cellStore.activeLeft(o.top, o.bottom)

            setSelectArea(o)
        }
    }, [mv])






    useEffect(() => {



        if (isSelecting.current && uv) {
            isSelecting.current = false

            cellStore.selectEnd = {
                ...uv
            }
            // if (selectArea) {
            //     setSelectArea({
            //         ...selectArea,
            //         border:true
            //     })
            // }

        }
    }, [uv])


    return (

        <div
            style={{
                pointerEvents: "none",
                position: "absolute",
                left: -leftCell.width,
                top: -headerCell.height,
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
                {getSelectAreaCell()}
                {getActiveCellSelection()}
            </div>
        </div>
    )
};

export default observer(SelectAreaLayer);
