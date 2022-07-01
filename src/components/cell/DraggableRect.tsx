import { CellStoreContext } from "@/stores/CellStore";
import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { KonvaEventObject } from "konva/lib/Node";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";
import _ from 'lodash'
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
                opacity={0}
                draggable
                onDragMove={_.throttle((e) => {
                    // console.log('sss')
                    const node = e.target;
                    node.opacity(0)
                    const newWidth = node.x() - props.ownx + props.width;
                    const k = props.ownKey
                    // onResize(columnIndex, newWidth);

                    cellStore.changeWidth(k, newWidth,node.x())
                },30)}
                hitStrokeWidth={20}
                onMouseEnter={(e) => {
                    (document.body.style.cursor = "ew-resize")
                    e.target.opacity(1)
                }}
                onMouseLeave={(e) =>{
                    (document.body.style.cursor = "default")
                    e.target.opacity(0)
                }}
                dragBoundFunc={_.throttle((pos) => {
                    // console.log(pos)
                    return {
                        ...pos,
                        y: 0,
                    };
                },30)}

                {...props}
            /> : <Rect
                fill="blue"
                type={type}
                opacity={0}
                draggable
                onDragMove={_.throttle((e: KonvaEventObject<DragEvent>) => {
                    // console.log('sss')
                    const node = e.target;
                    const newHeight = node.y() - props.owny + props.height;
                    node.opacity(0)
                    const k = props.ownKey
                    // onResize(columnIndex, newWidth);
                    // console.log(newHeight)

                    cellStore.changeHeight(k, newHeight)
                },30)}
                hitStrokeWidth={20}
                onMouseEnter={(e) => {
                    (document.body.style.cursor = "ns-resize")
                    e.target.opacity(1)
                }}
                onMouseLeave={(e) =>{
                    (document.body.style.cursor = "default")
                    e.target.opacity(0)
                }}
                dragBoundFunc={_.throttle((pos) => {
                    // console.log(pos)
                    return {
                        ...pos,
                        x: 0,
                    };
                },50)}

                {...props}
            />}

        </>
    );
});

export default DraggableRect