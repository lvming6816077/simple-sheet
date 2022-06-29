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

const EditAreaLayer = (props: any) => {

    const scrollLeft = 0
    const scrollTop = 0



    const rowStartIndex = 0, rowStopIndex = 30, columnStartIndex = 0, columnStopIndex = 9,
    cellHeight = 20, cellWidth = 100



    
    const mouseEventStore =  useContext(MouseEventStoreContext)
    const dbc = mouseEventStore.dbcCellAttr

    const [editCell,setEditCell] = useState<CellAttrs>(null)
    
    useEffect(()=>{
        setEditCell(dbc)
    },[dbc])

    useEffect(()=>{
        setEditCell(null)
    },[mouseEventStore.downCellAttr])


    const editCellRenderer = (o:any) => {
        const style:CSSProperties = {
            position:'absolute',
            left:o.x,
            top:o.y,
            borderWidth:o.strokeWidth,
            borderColor:o.stroke,
            width:o.width+1,
            height:o.height+1,
            borderStyle: 'solid',
            boxSizing: 'border-box',
            boxShadow:'rgb(60 64 67 / 15%) 0px 2px 6px 2px',
            backgroundColor: '#fff'
        }

        
        return (
        
            <div style={style}>
                <textarea className={styles['edit-textarea']} autoFocus onBlur={()=>console.log('blue')}></textarea>
            </div>
        )
    }

    const getEditCellSelection = useCallback(()=>{
        if (!editCell) return null

        const cell = editCellRenderer({
            stroke: "#1a73e8",
            strokeWidth: 2,
            fill: "transparent",
            x: editCell.x,
            y: editCell.y,
            width: cellWidth,
            height: cellHeight,
          });

        
          return cell

    },[editCell])



    return (
        <div
        style={{
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
              zIndex:3,
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
              {getEditCellSelection()}
            </div>
          </div>
        </div>
    )
};

export default observer(EditAreaLayer);
