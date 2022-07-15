import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
// import styles from "./styles.module.css";

import { Stage, Layer, Group, Line } from 'react-konva'
import Cell from '@/components/cell/Cell'
import { KonvaEventObject } from 'konva/lib/Node'
import SelectAreaLayer from '@/components/layer/selectArea/SelectAreaLayer'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { observer } from 'mobx-react-lite'
import EditAreaLayer from './components/layer/editArea/EditAreaLayer'
import { CellAttrs, CellStoreContext } from './stores/CellStore'
import _ from 'lodash'
import ScrollArea from './components/layer/scrollArea/ScrollArea'
import { getScrollWidthAndHeight } from './utils'
import ToolBar from './components/toolbar/ToolBar'

import {
    headerCell,
    leftCell,
    normalCell,
    singleCell,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    containerWidth,
    containerHeight,
} from '@/utils/constants'
import { CellOverlay } from './components/cell/CellOverlay'

interface IProps {
    src: string[]
    currentIndex?: number
    backgroundStyle?: CSSProperties
    disableScroll?: boolean
    closeOnClickOutside?: boolean
    onClose?: () => void
    closeComponent?: JSX.Element
    leftArrowComponent?: JSX.Element
    rightArrowComponent?: JSX.Element
}

const Grid = (props: any) => {
    const width = containerWidth
    const height = containerHeight

    const mouseEventStore = useContext(MouseEventStoreContext)
    const setDV = mouseEventStore.mouseDown
    const setUV = mouseEventStore.mouseUp
    const setMV = mouseEventStore.mouseMove
    const setDBC = mouseEventStore.mouseDBC

    const cellStore = useContext(CellStoreContext)

    const cellsMap = cellStore.cellsMap

    const cells = _.values(cellsMap)

    const header = cells.filter((i) => i?.type == 'header')
    const left = cells.filter((i) => i?.type == 'left')
    const single = cells.filter((i) => i?.type == 'single')
    const normal = cells.filter((i) => i?.type == 'normal')
    const border = cells.filter((i) => i?.borderStyle)

    // console.log(border)

    let { swidth, sheight } = useMemo(() => getScrollWidthAndHeight(cellsMap), [
        cellsMap,
    ])
    const scrolRef = useRef<HTMLDivElement>(null)

    const onScroll = (e: any) => {
        mouseEventStore.scrollLeft = e.target.scrollLeft
        mouseEventStore.scrollTop = e.target.scrollTop
    }

    const handleWheel = (event: any) => {
        const isHorizontally = event.shiftKey

        const { deltaX, deltaY, deltaMode } = event

        mouseEventStore.scrollTop = Math.min(
            606,
            Math.max(0, mouseEventStore.scrollTop + deltaY)
        )
    }

    useEffect(() => {
        scrolRef.current!.scrollTop = mouseEventStore.scrollTop
    }, [mouseEventStore.scrollTop])
    useEffect(() => {
        scrolRef.current!.scrollLeft = mouseEventStore.scrollLeft
    }, [mouseEventStore.scrollLeft])
    //
    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <ToolBar></ToolBar>
            <div style={{ width: width, height: height, position: 'relative' }}>
                <div
                    style={{
                        width: width,
                        height: height,
                        position: 'relative',
                        zIndex: 3,
                    }}
                    onWheel={handleWheel}
                >
                    <Stage
                        width={width}
                        height={height}
                        onDblClick={(e: KonvaEventObject<MouseEvent>) => {
                            setDBC({
                                ...e.target.attrs,
                                value: e.target.attrs.text,
                            } as CellAttrs)
                        }}
                        onMouseUp={(e: KonvaEventObject<MouseEvent>) =>
                            setUV({
                                ...e.target.attrs,
                                value: e.target.attrs.text,
                            } as CellAttrs)
                        }
                        onMouseMove={(e: KonvaEventObject<MouseEvent>) =>
                            setMV({
                                ...e.target.attrs,
                                value: e.target.attrs.text,
                            } as CellAttrs)
                        }
                        onMouseDown={(e: KonvaEventObject<MouseEvent>) =>
                            setDV({
                                ...e.target.attrs,
                                value: e.target.attrs.text,
                            } as CellAttrs)
                        }
                    >
                        <Layer>
                            <Group
                                offsetY={mouseEventStore.scrollTop}
                                offsetX={mouseEventStore.scrollLeft}
                            >
                                {normal.map((o) => (
                                    <Cell {...o}></Cell>
                                ))}
                            </Group>
                            <Group
                                offsetY={mouseEventStore.scrollTop}
                                offsetX={mouseEventStore.scrollLeft}
                            >
                                {border.map((o) => (
                                    <CellOverlay
                                        {...o}
                                        {...o?.borderStyle}
                                    ></CellOverlay>
                                ))}
                            </Group>
                            <Group offsetX={mouseEventStore.scrollLeft}>
                                {header.map((o) => (
                                    <Cell {...o}></Cell>
                                ))}
                            </Group>
                            <Group offsetY={mouseEventStore.scrollTop}>
                                {left.map((o) => (
                                    <Cell {...o}></Cell>
                                ))}
                            </Group>
                            {single.map((o) => (
                                <Cell {...o}></Cell>
                            ))}
                        </Layer>
                    </Stage>
                    <div
                        style={{
                            pointerEvents: 'none',
                            position: 'absolute',
                            left: leftCell.width,
                            top: headerCell.height,
                            right: 0,
                            bottom: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <SelectAreaLayer></SelectAreaLayer>
                        <EditAreaLayer></EditAreaLayer>
                    </div>
                </div>
                <div
                    style={{
                        width: width + 20,
                        height: height + 20,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        overflow: 'auto',
                        zIndex: 1,
                    }}
                    onScroll={onScroll}
                    ref={scrolRef}
                >
                    <ScrollArea swidth={swidth} sheight={sheight}></ScrollArea>
                </div>
            </div>
        </div>
    )
}

export default observer(Grid)
