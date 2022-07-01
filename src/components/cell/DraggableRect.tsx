import { CellStoreContext } from "@/stores/CellStore";
import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { KonvaEventObject } from "konva/lib/Node";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect, Line } from "react-konva";
const DraggableRect = ((props: any) => {
    const cellStore = useContext(CellStoreContext)
    const {
        type
    } = props
    return (
        <>
            {type == 'header' ? <Rect
                fill="blue"
                type={props.type}
                draggable
                onDragMove={(e: KonvaEventObject<DragEvent>) => {
                    // console.log('sss')
                    const node = e.target;
                    const newWidth = node.x() - props.ownx + props.width;
                    const k = props.ownKey
                    // onResize(columnIndex, newWidth);

                    cellStore.changeWidth(k, newWidth)
                }}
                hitStrokeWidth={20}
                onMouseEnter={() => (document.body.style.cursor = "ew-resize")}
                onMouseLeave={() => (document.body.style.cursor = "default")}
                dragBoundFunc={(pos) => {
                    // console.log(pos)
                    return {
                        ...pos,
                        y: 0,
                    };
                }}
                {...props}
            /> : <Rect
                fill="blue"
                type={type}
                draggable
                onDragMove={(e: KonvaEventObject<DragEvent>) => {
                    // console.log('sss')
                    const node = e.target;
                    const newHeight = node.y() - props.owny + props.height;
                    const k = props.ownKey
                    // onResize(columnIndex, newWidth);
                    // console.log(newHeight)

                    cellStore.changeHeight(k, newHeight)
                }}
                hitStrokeWidth={20}
                onMouseEnter={() => (document.body.style.cursor = "ns-resize")}
                onMouseLeave={() => (document.body.style.cursor = "default")}
                dragBoundFunc={(pos) => {
                    // console.log(pos)
                    return {
                        ...pos,
                        x: 0,
                    };
                }}
                {...props}
            />}

        </>
    );
});

export default DraggableRect