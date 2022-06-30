import React, { CSSProperties, useCallback, useContext, useEffect, useState } from "react";
// import styles from "./styles.module.css";

import { Stage, Layer, Group, Line } from "react-konva";
import Cell from "@/components/cell/Cell";
import { KonvaEventObject } from "konva/lib/Node";
import SelectAreaLayer from "@/components/layer/selectArea/SelectAreaLayer";

import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import { observer } from 'mobx-react-lite'
import EditAreaLayer from "./components/layer/editArea/EditAreaLayer";
import { CellAttrs, CellStoreContext } from "./stores/CellStore";

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

    const width = 901
    const height = 601
    const scrollLeft = 0
    const scrollTop = 0

    const mouseEventStore = useContext(MouseEventStoreContext)
    const setDV = mouseEventStore.mouseDown
    const setUV = mouseEventStore.mouseUp
    const setMV = mouseEventStore.mouseMove
    const setDBC = mouseEventStore.mouseDBC

    const cellStore = useContext(CellStoreContext)





    const cells = cellStore.cells




    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <Stage width={width} height={height}
                onDblClick={(e: KonvaEventObject<MouseEvent>) => {
                    setDBC({ ...e.target.attrs , value: e.target.attrs.text } as CellAttrs)
                }}
                onMouseUp={(e: KonvaEventObject<MouseEvent>) => setUV( { ...e.target.attrs , value: e.target.attrs.text } as CellAttrs)}
                onMouseMove={(e: KonvaEventObject<MouseEvent>) => setMV( { ...e.target.attrs , value: e.target.attrs.text } as CellAttrs )}
                onMouseDown={(e: KonvaEventObject<MouseEvent>) => setDV({ ...e.target.attrs , value: e.target.attrs.text } as CellAttrs)} >
                <Layer>
                    <Group offsetY={scrollTop} offsetX={scrollLeft}>
                        {cells.map((o) => <Cell {...o}></Cell>)}
                    </Group>
                </Layer>
            </Stage>
            <SelectAreaLayer></SelectAreaLayer>
            <EditAreaLayer></EditAreaLayer>
        </div>
    )
};

export default observer(Grid);
