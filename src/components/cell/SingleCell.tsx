import { CellAttrs, CellStoreContext } from "@/stores/CellStore";
import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { KonvaEventObject } from "konva/lib/Node";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect, Line } from "react-konva";




const SingleCell = React.memo(((props:any) => {
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

    let x = props.x+0,y = props.y+0


    let text = String.fromCharCode(Number(ownKey.split(':')[1])+64)

    const textStyle = `${fontWeight} ${fontStyle}`;


    return (
        <>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x}
                y={y}
                height={height}
                width={width}
                fill={'#fff'}
                
            ></Rect>
            
        </>
    );
}));

export default SingleCell;
