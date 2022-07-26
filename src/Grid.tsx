import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
// import styles from "./styles.module.css";

import { Stage, Layer, Group, Text } from 'react-konva'
import Cell from '@/components/cell/Cell'
import { KonvaEventObject } from 'konva/lib/Node'
import SelectAreaLayer from '@/components/layer/selectArea/SelectAreaLayer'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import EditAreaLayer from './components/layer/editArea/EditAreaLayer'
import { CellAttrs, CellMap, CellStoreContext } from './stores/CellStore'
import _ from 'lodash'
import ScrollArea from './components/layer/scrollArea/ScrollArea'
import { generaCell, getScrollWidthAndHeight } from './utils'
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
    initConstants,
} from '@/utils/constants'
import { CellOverlay } from './components/cell/CellOverlay'
import CornerArea from './components/layer/cornerArea/CornerArea'
import Konva from 'konva'
import { ToolBarStoreContext } from './stores/ToolBarStore'
import FloatImage from './components/toolbar/components/FloatImage'
import { FloatImageStoreContext } from './stores/FloatImageStore'

export interface GridProps {
    width?: number
    height?: number
    onRef?: any
    initData?: CellMap
}

const Grid = observer(
    (props: GridProps, ref: any) => {
        initConstants(props)

        useImperativeHandle(ref, () => ({
            getCellData,
            setCellData,
            stage: stageRef.current,
        }))
        const getCellData = () => {
            return toJS(cellsMap)
        }
        const setCellData = (map: CellMap) => {
            cellStore.cellsMap = map
        }
        const width = containerWidth
        const height = containerHeight

        const mouseEventStore = useContext(MouseEventStoreContext)
        const setDV = mouseEventStore.mouseDown
        const setUV = mouseEventStore.mouseUp
        const setMV = mouseEventStore.mouseMove
        const setDBC = mouseEventStore.mouseDBC

        const cellStore = useContext(CellStoreContext)
        const toolbarStore = useContext(ToolBarStoreContext)
        const floatImageStore = useContext(FloatImageStoreContext)

        var cellsMap = cellStore.cellsMap

        if (props.initData) {
            cellsMap = generaCell(props.initData)
        }

        const cells = _.values(cellsMap)

        const header = cells.filter((i) => i?.type == 'header')
        const left = cells.filter((i) => i?.type == 'left')
        const single = cells.filter((i) => i?.type == 'single')
        const normal = cells.filter((i) => i?.type == 'normal')
        const border = cells.filter((i) => i?.borderStyle)

        let { swidth, sheight } = useMemo(
            () => getScrollWidthAndHeight(cellsMap),
            [cellsMap]
        )
        const scrolRef = useRef<HTMLDivElement>(null)

        const onScroll = (e: any) => {
            mouseEventStore.scrollLeft = e.target.scrollLeft
            mouseEventStore.scrollTop = e.target.scrollTop
        }

        const wheelRef = useRef<HTMLDivElement>(null)

        const handleWheel = (event: any) => {
            event.preventDefault()
            const isHorizontally = event.shiftKey

            const { deltaX, deltaY, deltaMode } = event

            // console.log(sheight - containerHeight)

            mouseEventStore.scrollTop = Math.min(
                sheight - containerHeight - 3,
                Math.max(0, mouseEventStore.scrollTop + deltaY)
            )
        }
        useEffect(() => {
            wheelRef.current?.addEventListener('wheel', handleWheel, {
                passive: false,
            })

            return () => {
                wheelRef.current?.removeEventListener('wheel', handleWheel)
            }
        })

        useEffect(() => {
            scrolRef.current!.scrollTop = mouseEventStore.scrollTop
        }, [mouseEventStore.scrollTop])
        useEffect(() => {
            scrolRef.current!.scrollLeft = mouseEventStore.scrollLeft
        }, [mouseEventStore.scrollLeft])

        // useEffect(()=>{
        //     console.log(toolbarStore.floatImage)
        // },[toolbarStore.floatImage])

        const stageRef = useRef<Konva.Stage>(null)

        return (
            <div
                style={{ width: width, height: height, position: 'relative' }}
                id="container"
            >
                <ToolBar stageRef={stageRef}></ToolBar>
                <div
                    style={{
                        width: width,
                        height: height,
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            width: width,
                            height: height,
                            position: 'relative',
                            zIndex: 4,
                        }}
                        ref={wheelRef}
                    >
                        <Stage width={width} height={height} ref={stageRef}>
                            <Layer
                                onDblClick={(
                                    e: KonvaEventObject<MouseEvent>
                                ) => {
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
                                onMouseMove={(
                                    e: KonvaEventObject<MouseEvent>
                                ) => {
                                    // console.log('xxx')
                                    setMV({
                                        ...e.target.attrs,
                                        value: e.target.attrs.text,
                                    } as CellAttrs)
                                }}
                                onMouseDown={(
                                    e: KonvaEventObject<MouseEvent>
                                ) =>
                                    setDV({
                                        ...e.target.attrs,
                                        value: e.target.attrs.text,
                                    } as CellAttrs)
                                }
                            >
                                <Group
                                    offsetY={mouseEventStore.scrollTop}
                                    offsetX={mouseEventStore.scrollLeft}
                                >
                                    {normal.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
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
                                            key={o?.ownKey}
                                        ></CellOverlay>
                                    ))}
                                </Group>
                                <Group offsetX={mouseEventStore.scrollLeft}>
                                    {header.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
                                    ))}
                                </Group>
                                <Group offsetY={mouseEventStore.scrollTop}>
                                    {left.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
                                    ))}
                                </Group>
                                {single.map((o) => (
                                    <Cell {...o} key={o?.ownKey}></Cell>
                                ))}
                            </Layer>
                            <Layer>
                                {floatImageStore.floatImage.map((o) => (
                                    <FloatImage {...o} key={o.id}></FloatImage>
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
                        <ScrollArea
                            swidth={swidth}
                            sheight={sheight}
                        ></ScrollArea>
                    </div>
                    <div
                        style={{
                            width: width,
                            height: height,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            overflow: 'auto',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            zIndex: 5,
                        }}
                    >
                        <CornerArea></CornerArea>
                    </div>
                </div>
            </div>
        )
    },
    { forwardRef: true }
)

export default Grid
