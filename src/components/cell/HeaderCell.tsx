import { CellStoreContext } from "@/stores/CellStore";
import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { KonvaEventObject } from "konva/lib/Node";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect, Line } from "react-konva";
import DraggableRect from "./DraggableRect";



const HeaderCell = (observer((props:any) => {
    let {

        width,
        height,
        ownKey,
        fill = "#f8f9fa",
        strokeWidth = 1.5,
        stroke = "#c6c6c6",
        align = "center",
        verticalAlign = "middle",
        textColor = "#333",
        padding = 5,
        fontFamily = "Arial",
        fontSize = 12,
        children,
        wrap = "none",
        fontWeight = "normal",
        fontStyle = "normal",
        textDecoration,
        alpha = 1,
        strokeEnabled = true,
        globalCompositeOperation = "multiply",
        type,
    } = props;

    let x = props.x+0.5,y = props.y+0.5


    let text = String.fromCharCode(Number(ownKey.split(':')[1])+64)

    const cellStore = useContext(CellStoreContext)

    const mouseEventStore =  useContext(MouseEventStoreContext)
    

    const [ownFill,setOwnFill] = useState<string>(fill)
    
    const dv = mouseEventStore.getdownCellAttr
    useEffect(()=>{
        if (!dv) return
        // console.log(x,y)
        if (dv.x == x) {
            setOwnFill('blue')
        } else {
            setOwnFill(fill)
        }
    },[dv])


    const textStyle = `${fontWeight} ${fontStyle}`;


    const isFirst = ownKey == '0:1'
    const dragHandleWidth = 5


    return (
        <>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x}
                y={y}
                height={height}
                width={width}
                fill={ownFill}
                
            ></Rect>
            <Text
                x={x}
                y={y}
                height={height}
                width={width}
                text={text+'.'+ownKey}
                fill={textColor}
                verticalAlign={verticalAlign}
                align={align}
                fontFamily={fontFamily}
                fontStyle={textStyle}
                textDecoration={textDecoration}
                padding={padding}
                wrap={wrap}
                fontSize={fontSize}
                hitStrokeWidth={0}
                type={type}
            />
            
            {false ? null : 
            <DraggableRect
                {...props}
                x={x-3 + width}
                y={y}
                height={height}
                width={dragHandleWidth}
                ownx={props.x}
                
            ></DraggableRect>}
            
        </>
    );
}));

export default HeaderCell;
