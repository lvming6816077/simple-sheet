import React, {
    CSSProperties,
    KeyboardEventHandler,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
// import styles from "./styles.module.css";

import { Stage, Layer, Group, Text, Rect } from 'react-konva'
import Cell from '@/components/cell/Cell'
import { KonvaEventObject } from 'konva/lib/Node'
import SelectAreaLayer from '@/components/layer/selectArea/SelectAreaLayer'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import EditAreaLayer from './components/layer/editArea/EditAreaLayer'
import {
    CellAttrs,
    CellMap,
    CellStoreContext,
    MouseClick,
} from './stores/CellStore'
import _ from 'lodash'
import ScrollArea from './components/layer/scrollArea/ScrollArea'
import { generaCell, getScrollWidthAndHeight } from './utils'
import ToolBar from './components/toolbar/ToolBar'

import {
    headerCell,
    leftCell,
    normalCell,
    singleCell,
    rowStopIndex,
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
import ContextMenuLayer from './components/layer/contextMenuArea/ContextMenuLayer'
import Viewer from 'react-viewer'
import { useSize } from './hooks/useSize'
import { CopyStoreContext } from './stores/CopyStore'
import SingleArea from './components/layer/singleArea/SingleArea'

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
        const setRC = mouseEventStore.mouseRC

        const cellStore = useContext(CellStoreContext)
        const toolbarStore = useContext(ToolBarStoreContext)
        const floatImageStore = useContext(FloatImageStoreContext)
        const copyStore = useContext(CopyStoreContext)

        var cellsMap = cellStore.cellsMap

        if (props.initData) {
            cellsMap = generaCell(
                props.initData,
                cellStore.rowStopIndex,
                cellStore.columnStopIndex
            )
        }

        const cells = _.values(cellsMap)

        const header = cells.filter((i) => i?.type == 'header')
        const left = cells.filter((i) => i?.type == 'left')
        const single = cells.filter((i) => i?.type == 'single')
        const normal = cells.filter((i) => i?.type == 'normal')
        const border = cells.filter((i) => i?.borderStyle)

        let { swidth, sheight } = useSize()
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

        const mouseEventProp = {
            onMouseUp: (e: KonvaEventObject<MouseEvent>) =>
                setUV({
                    ...e.target.attrs,
                    value: e.target.attrs.text,
                } as CellAttrs),
            onMouseMove: (e: KonvaEventObject<MouseEvent>) => {
                setMV({
                    ...e.target.attrs,
                    value: e.target.attrs.text,
                } as CellAttrs)
            },
            onMouseDown: (e: KonvaEventObject<MouseEvent>) => {
                // console.log(e.evt.button)
                // if (e.evt.button == 2) return // 鼠标左键
                setDV({
                    ...e.target.attrs,
                    value: e.target.attrs.text,
                    rightClick: e.evt.button == 2,
                } as MouseClick)
            },
        }

        const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (cellStore.editCell) return
            if (event.ctrlKey && event.keyCode === 67) {
                console.log('你按下了CTRL+C')
                copyStore.copyCurrentCells(cellStore)
            }
            if (event.ctrlKey && event.keyCode === 86) {
                console.log('你按下了CTRL+V')
                copyStore.pasteCurrentCells(cellStore)
            }

            if (event.ctrlKey && event.keyCode === 88) {
                console.log('你按下了CTRL+X')
                copyStore.cutCurrentCells(cellStore)
            }

            if (event.keyCode == 46 || event.keyCode == 8) {
                console.log('delete')

                copyStore.delCurrentCells(cellStore, floatImageStore)
            }
        }

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
                        outline: 'none',
                    }}
                    tabIndex={1}
                    onKeyDown={onKeyDown}
                >
                    <div
                        style={{
                            width: width,
                            height: height,
                            position: 'relative',
                            zIndex: 4,
                        }}
                        id={'canvasWrap'}
                        ref={wheelRef}
                    >
                        <Stage
                            onKeyDown={onKeyDown}
                            width={width}
                            height={height}
                            ref={stageRef}
                            
                            zIndex={4}
                            onContextMenu={(
                                e: KonvaEventObject<PointerEvent>
                            ) => {
                                e.evt.preventDefault()
                                setRC({
                                    clientX: e.evt.clientX,
                                    clientY: e.evt.clientY,
                                    ...e.target.attrs,
                                    value: e.target.attrs.text,
                                })
                            }}
                        >
                            <Layer>
                                <Group
                                    offsetY={mouseEventStore.scrollTop}
                                    offsetX={mouseEventStore.scrollLeft}
                                    {...mouseEventProp}
                                    onDblClick={(
                                        e: KonvaEventObject<MouseEvent>
                                    ) => {
                                        if (e.evt.button == 2) return // 鼠标左键
                                        setDBC({
                                            ...e.target.attrs,
                                            value: e.target.attrs.text,
                                        } as CellAttrs)
                                    }}
                                >
                                    {/* // 白色背景 */}
                                    <Rect
                                        width={swidth}
                                        height={sheight}
                                        fill={'#fff'}
                                    ></Rect>
                                    {normal.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
                                    ))}
                                    {border.map((o) => (
                                        <CellOverlay
                                            {...o}
                                            {...o?.borderStyle}
                                            key={o?.ownKey}
                                        ></CellOverlay>
                                    ))}
                                </Group>
                                <Group
                                    offsetY={mouseEventStore.scrollTop}
                                    offsetX={mouseEventStore.scrollLeft}
                                >
                                    {floatImageStore.floatImage.map((o) => (
                                        <FloatImage
                                            {...o}
                                            key={o.id}
                                        ></FloatImage>
                                    ))}
                                </Group>

                                <Group
                                    offsetX={mouseEventStore.scrollLeft}
                                    {...mouseEventProp}
                                >
                                    {header.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
                                    ))}
                                </Group>
                                <Group
                                    offsetY={mouseEventStore.scrollTop}
                                    {...mouseEventProp}
                                >
                                    {left.map((o) => (
                                        <Cell {...o} key={o?.ownKey}></Cell>
                                    ))}
                                </Group>
                                {single.map((o) => (
                                    <Cell {...o} key={o?.ownKey}></Cell>
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
                        <ContextMenuLayer></ContextMenuLayer>
                        <SingleArea></SingleArea>
                        
                    </div>
                </div>
                <Viewer
                    noNavbar={true}
                    showTotal={false}
                    visible={toolbarStore.currentBigImg.length > 0}
                    onClose={() => {
                        toolbarStore.currentBigImg = []
                    }}
                    images={toolbarStore.currentBigImg}
                />
            </div>
        )
    },
    { forwardRef: true }
)

export default Grid
