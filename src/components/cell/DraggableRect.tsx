import { CellStoreContext } from '@/stores/CellStore'
import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { KonvaEventObject } from 'konva/lib/Node'
import { observer } from 'mobx-react-lite'
import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import _, { zip } from 'lodash'
import { Stage, Text, Group, Rect, Line } from 'react-konva'
import {
    containerHeight,
    containerWidth,
    dragMinWidth,
    dragMinHeight,
    leftCell,
    normalCell,
} from '@/utils/constants'
const DraggableRect = React.memo((props: any) => {
    const cellStore = useContext(CellStoreContext)
    const mouseEventStore = useContext(MouseEventStoreContext)

    const { type, x, y, height, width } = props

    return (
        <>
            {type == 'header' ? (
                <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#8b8b8b"
                    type={props.type}
                    opacity={0}
                    draggable
                    onDragMove={(e) => {
                        const node = e.target
                        if (node.height() !== containerHeight) {
                            node.zIndex(70)
                            node.height(containerHeight)
                            node.width(1)
                            node.opacity(0.5)
                        }
                    }}
                    onDragEnd={(e) => {
                        const node = e.target
                        node.width(width)
                        node.height(height)

                        const newWidth = node.x() - props.ownx + props.width
                        const k = props.ownKey

                        cellStore.changeWidth(
                            k,
                            Math.max(newWidth, dragMinWidth)
                        )

                        node.opacity(0)
                    }}
                    onMouseEnter={(e) => {
                        e.target.opacity(1)
                        document.body.style.cursor = 'ew-resize'
                    }}
                    onMouseLeave={(e) => {
                        e.target.opacity(0)
                        document.body.style.cursor = 'default'
                    }}
                    dragBoundFunc={(pos) => {
                        var rx = props.ownx - mouseEventStore.scrollLeft
                        if (pos.x - rx < dragMinWidth) {
                            return {
                                x: dragMinWidth + rx,
                                y: 0,
                            }
                        }

                        return {
                            ...pos,
                            y: 0,
                        }
                    }}
                />
            ) : (
                <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#8b8b8b"
                    type={type}
                    opacity={0}
                    draggable
                    onDragMove={(e) => {
                        const node = e.target
                        if (node.width() !== containerWidth) {
                            node.setZIndex(40)

                            node.width(containerWidth)
                            node.height(1)
                            node.opacity(0.5)
                        }
                    }}
                    onDragEnd={(e) => {
                        const node = e.target
                        node.width(width)
                        node.height(height)
                        node.opacity(0)

                        const newHeight = node.y() - props.owny + props.height
                        const k = props.ownKey

                        cellStore.changeHeight(
                            k,
                            Math.max(newHeight, dragMinHeight)
                        )
                    }}
                    onMouseEnter={(e) => {
                        document.body.style.cursor = 'ns-resize'
                        e.target.opacity(1)
                    }}
                    onMouseLeave={(e) => {
                        document.body.style.cursor = 'default'
                        e.target.opacity(0)
                    }}
                    dragBoundFunc={(pos) => {
                        var ry = props.owny - mouseEventStore.scrollTop
                        if (pos.y - ry < dragMinHeight) {
                            return {
                                y: ry + dragMinHeight,
                                x: 0,
                            }
                        }
                        return {
                            ...pos,
                            x: 0,
                        }
                    }}
                />
            )}
        </>
    )
})

export default DraggableRect
