import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";


import { CellAttrs, MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'

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

    const scrollLeft = 0
    const scrollTop = 0
    const isSelecting = useRef(false);
    const selectStart = useRef<CellAttrs>(null);
    const [selectEnd,setSelectEnd] = useState<CellAttrs>(null);
    const [selectArea,setSelectArea] = useState<string|null>(null)



    // const cellWidth = 

    const rowStartIndex = 0, rowStopIndex = 30, columnStartIndex = 0, columnStopIndex = 9,
    cellHeight = 20, cellWidth = 100

    const selectAreaRenderer = (o:any) => {
        const style:CSSProperties = {
            position:'absolute',
            left:o.left,
            top:o.top,
            width:o.right-o.left+cellWidth,
            height:o.bottom-o.top+cellHeight,
            border:''
            
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

    
    const getSelectAreaCell = useCallback(()=>{
        if (!selectArea) return null

        const o = JSON.parse(selectArea)

        if (selectEnd) {
            o.border = true
        } else {
            o.border = false
        }

        const cell = selectAreaRenderer(o);

        
        return cell

    },[selectArea,selectEnd])


    const [activeCell,setActiveCell] = useState<any>({})
    


    const activeCellRenderer = (o:any) => {
        const style:CSSProperties = {
            position:'absolute',
            left:o.x,
            top:o.y,
            borderWidth:o.strokeWidth,
            borderColor:o.stroke,
            width:o.width+1,
            height:o.height+1,
            borderStyle: 'solid',
            boxSizing: 'border-box'

        }
        return <div style={style}></div>
    }

    const getActiveCellSelection = useCallback(()=>{

        if (!activeCell) return null

        const cell = activeCellRenderer({
            stroke: "#1a73e8",
            strokeWidth: 2,
            fill: "transparent",
            x: activeCell.x,
            y: activeCell.y,
            width: cellWidth,
            height: cellHeight,
          });

        
          return cell

    },[activeCell])

    
    const mouseEventStore =  useContext(MouseEventStoreContext)
    const dv = mouseEventStore.downCellAttr
    const uv = mouseEventStore.upCellAttr
    const mv = mouseEventStore.moveCellAttr


    
    useEffect(()=>{
        setActiveCell(dv)
        setSelectArea(null)
        isSelecting.current = true
        setSelectEnd(null)
        selectStart.current = dv ? {
            x:dv.x,
            y:dv.y
        } : null
    },[dv])

    useEffect(()=>{
        if (isSelecting.current && mv) {
            
            const cur = {
                x:mv.x,
                y:mv.y
            }
            const start = selectStart.current

            if (start == null) return

            if (cur.x == start.x && cur.y == start.y) {
                setSelectArea(null)
                return
            }

            let top = Math.min(start.y, cur.y);
            let bottom = Math.max(start.y, cur.y);
            let left = Math.min(start.x, cur.x);
            let right = Math.max(start.x, cur.x);

            const o = JSON.stringify({top,bottom,left,right})

            setSelectArea(o)
        }
    },[mv])






    useEffect(()=>{
        if (isSelecting.current && uv) {
            isSelecting.current = false
            
            setSelectEnd({
                x:uv.x,
                y:uv.y
            })
        }
    },[uv])




    return (
        <div style={{
                pointerEvents: "none",
              }}
            >
              <div
                style={{
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
                    transform: `translate(-${scrollLeft + 0}px, -${
                      scrollTop + 0
                    }px)`,
                  }}
                >
                  {getSelectAreaCell()}
                  {getActiveCellSelection()}
                </div>
              </div>
            </div>
    )
};

export default observer(SelectAreaLayer);
