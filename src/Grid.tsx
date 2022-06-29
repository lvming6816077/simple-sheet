import React, { CSSProperties, useCallback, useContext, useEffect, useState } from "react";
// import styles from "./styles.module.css";

import { Stage, Layer, Group, Line } from "react-konva";
import Cell from "@/components/cell/Cell";
import { KonvaEventObject } from "konva/lib/Node";
import SelectAreaLayer from "@/components/layer/selectArea/SelectAreaLayer";

import { CellAttrs, MouseEventStoreContext } from "@/stores/MouseEventStore";
import { observer } from 'mobx-react-lite'
import EditAreaLayer from "./components/layer/editArea/EditAreaLayer";

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



const Grid = (props: any) => {

    const mouseEventStore =  useContext(MouseEventStoreContext)
    const setDV = mouseEventStore.mouseDown
    const setUV = mouseEventStore.mouseUp
    const setMV = mouseEventStore.mouseMove
    const setDBC = mouseEventStore.mouseDBC
    const rowStartIndex: number = 0, rowStopIndex: number = 30, columnStartIndex: number = 0, columnStopIndex: number = 9,
        cellHeight: number = 20, cellWidth: number = 100

    const getRowOffset = (index: number) => {

        return index * cellHeight
    }
    const getColumnOffset = (index: number) => {
        return index * cellWidth
    }

    const getRowHeight = () => {
        return cellHeight
    }

    const getColumnWidth = () => {
        return cellWidth
    }

    const itemRenderer = (o: any) => {
        return <Cell {...o}></Cell>
    }

    const width = 901;
    const height = 601

    const scrollTop = 0
    const scrollLeft = 0

    const cells = []

    for (let rowIndex: number = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {

        for (let columnIndex: number = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {

            const y = getRowOffset(rowIndex);

            const x = getColumnOffset(columnIndex);

            const width = getColumnWidth()

            const height = getRowHeight()

            cells.push(
                itemRenderer({
                    x,
                    y,
                    width,
                    height,
                    value: '',
                    key: rowIndex + ':' + columnIndex,
                })
            );

        }
    }

//{(e)=>setEditCell(e.target)}
    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <Stage width={width} height={height} 
            onDblClick={(e: KonvaEventObject<MouseEvent>) => setDBC({ x: e.target.attrs.x, y: e.target.attrs.y })} 
            onMouseUp={(e: KonvaEventObject<MouseEvent>) => setUV({ x: e.target.attrs.x, y: e.target.attrs.y })} 
            onMouseMove={(e: KonvaEventObject<MouseEvent>) => setMV({ x: e.target.attrs.x, y: e.target.attrs.y })} 
            onMouseDown={(e: KonvaEventObject<MouseEvent>) => setDV({ x: e.target.attrs.x, y: e.target.attrs.y })} >
                <Layer>
                    <Group offsetY={scrollTop} offsetX={scrollLeft}>
                        {cells}
                    </Group>
                </Layer>
            </Stage>
            <SelectAreaLayer></SelectAreaLayer>
            <EditAreaLayer></EditAreaLayer>
        </div>
    )
};

export default observer(Grid);
