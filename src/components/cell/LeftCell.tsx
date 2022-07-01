import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";
import DraggableRect from "./DraggableRect";



const LeftCell = React.memo(observer((props:any) => {
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
    } = props;

    let x = props.x+0.5,y = props.y+0.5

    const mouseEventStore =  useContext(MouseEventStoreContext)
    

    const [ownFill,setOwnFill] = useState<string>(fill)
    
    const dv = mouseEventStore.getdownCellAttr
    useEffect(()=>{
        if (!dv) return
        // console.log(x,y)
        if (dv.y == y) {
            setOwnFill('blue')
        } else {
            setOwnFill(fill)
        }
    },[dv])

    // const width = 60,height = 20

    let text = ownKey.split(':')[0]

    const dragHandleHeight = 4

    const textStyle = `${fontWeight} ${fontStyle}`;

    return (
        <Group>
            <Rect
                stroke={stroke}
                strokeWidth={strokeWidth}
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
                    text={text}
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
                />
                {false ? null : 
            <DraggableRect
                {...props}
                x={x}
                y={y-3 + height}
                height={dragHandleHeight}
                width={width}
                owny={props.y}
                
            ></DraggableRect>}
        </Group>
    );
}));

export default LeftCell;
