import { CellStoreContext } from "@/stores/CellStore";
import { KonvaEventObject } from "konva/lib/Node";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect, Line } from "react-konva";



const HeaderCell = React.memo((props:any) => {
    let {
        x = 0,
        y = 0,
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
        ...rest
    } = props;


    let text = String.fromCharCode(Number(ownKey.split(':')[1])+64)

    const cellStore = useContext(CellStoreContext)




    const textStyle = `${fontWeight} ${fontStyle}`;


    const isFirst = ownKey == '0:1'
    const dragHandleWidth = 5
    const DraggableRect = (props:any) => {
        return (
            <>
          <Rect
            fill="blue"
            type={type}
            draggable
            hitStrokeWidth={20}
            onMouseEnter={() => (document.body.style.cursor = "ew-resize")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
            dragBoundFunc={(pos) => {
              return {
                ...pos,
                y: 0,
              };
            }}
            {...props}
          />
            </>
        );
      };

    return (
        <Group>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x+0.5}
                y={y+0.5}
                height={height}
                width={width}
                fill={fill}
                
            ></Rect>
            <Text
                x={x+0.5}
                y={y+0.5}
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
                x={x-3 + width}
                y={y}
                height={height}
                width={dragHandleWidth}
                onDragMove={(e:KonvaEventObject<DragEvent>) => {
                    const node = e.target;
                    const newWidth = node.x() - x + dragHandleWidth;
                    const k = ownKey
                    // onResize(columnIndex, newWidth);
                    // console.log(k)
                    cellStore.changeWidth(k,newWidth)
                  }}
            ></DraggableRect>}
            
        </Group>
    );
});

export default HeaderCell;
