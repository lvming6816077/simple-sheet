import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { leftCell } from "@/utils/constants";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";
import DraggableRect from "./DraggableRect";



const LeftCell = React.memo(((props:any) => {
    let {

        width,
        height,
        ownKey,
        fill = leftCell.fill,
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

    let x = props.x+0,y = props.y+0

    const mouseEventStore =  useContext(MouseEventStoreContext)
    


    
    // const dv = mouseEventStore.getdownCellAttr
    // useEffect(()=>{
    //     if (!dv) return
    //     // console.log(x,y)
    //     if (dv.y == y) {
    //         setOwnFill('blue')
    //     } else {
    //         setOwnFill(fill)
    //     }
    // },[dv])

    // const width = 60,height = 20


    let text = ownKey.split(':')[0]

    const dragHandleHeight = 3

    const textStyle = `${fontWeight} ${fontStyle}`;

    return (
        <Group>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x}
                y={y}
                type={type}
                height={height}
                width={width}
                fill={fill}
            ></Rect>
            <Text
                    x={x}
                    y={y}
                    height={height}
                    width={width}
                    text={text}
                    fill={textColor}
                    verticalAlign={verticalAlign}
                    align={align}
                    fontFamily={fontFamily}
                    fontStyle={textStyle}
                    textDecoration={textDecoration}
                    padding={padding}
                    wrap={wrap}
                    type={type}
                    fontSize={fontSize}
                    hitStrokeWidth={0}
                />
                {false ? null : 
            <DraggableRect
                {...props}
                x={x}
                y={y-dragHandleHeight + height}
                height={dragHandleHeight}
                width={width}
                owny={props.y}
                
            ></DraggableRect>}
        </Group>
    );
}));

export default LeftCell;
