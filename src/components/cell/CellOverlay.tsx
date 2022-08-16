import { CellStoreContext } from '@/stores/CellStore'
import React, { memo, useContext } from 'react'
// import { CellProps } from "./Cell";
import { Shape } from 'react-konva'
// import { RendererProps } from "./Grid";

const EMPTY_ARRAY: number[] = []

export const getOffsetFromWidth = (width: number) => {
    return width / 2 - 0.5
}

const CellOverlay = React.memo((props: any) => {
    var {
        x,
        y,
        width,
        height,
        // stroke,
        color,
        strokeTopColor = color,
        strokeRightColor = color,
        strokeBottomColor = color,
        strokeLeftColor = color,
        strokeDash = EMPTY_ARRAY,
        strokeTopDash = strokeDash,
        strokeRightDash = strokeDash,
        strokeBottomDash = strokeDash,
        strokeLeftDash = strokeDash,
        strokeWidth = 0.5,
        strokeTopWidth = strokeWidth,
        strokeRightWidth = strokeWidth,
        strokeBottomWidth = strokeWidth,
        strokeLeftWidth = strokeWidth,
        lineCap = 'butt',
        ownKey,
        isMerge,
    } = props
    //   console.log(ownKey)

    const cellStore = useContext(CellStoreContext)
    const cellsMap = cellStore.cellsMap
    var mergeRect: {
        [key: string]: number
    } = {}

    if (isMerge) {
        const [firstkey, endkey] = isMerge
        if (ownKey == endkey) {
            mergeRect = {
                x: cellsMap[firstkey]!.x,
                y: cellsMap[firstkey]!.y,
                width:
                    cellsMap[endkey]!.x -
                    cellsMap[firstkey]!.x +
                    cellsMap[endkey]!.width,
                height:
                    cellsMap[endkey]!.y -
                    cellsMap[firstkey]!.y +
                    cellsMap[endkey]!.height,
            }
            x = mergeRect.x
            y = mergeRect.y
            width = mergeRect.width
            height = mergeRect.height
        } else {
            return null
        }
    }

    const userStroke =
        strokeTopColor ||
        strokeRightColor ||
        strokeBottomColor ||
        strokeLeftColor
    if (!userStroke) return null

    return (
        <Shape
            x={x}
            y={y}
            key={ownKey}
            width={width}
            height={height}
            sceneFunc={(context, shape) => {
                /* Top border */
                if (strokeTopColor) {
                    context.beginPath()
                    context.moveTo(
                        strokeLeftColor
                            ? -getOffsetFromWidth(strokeLeftWidth)
                            : 0,
                        0.5
                    )
                    context.lineTo(
                        shape.width() +
                            (strokeRightColor
                                ? getOffsetFromWidth(strokeRightWidth) + 1
                                : 1),
                        0.5
                    )
                    context.setAttr('strokeStyle', strokeTopColor)
                    context.setAttr('lineWidth', 1)
                    context.setAttr('lineCap', lineCap)
                    context.setLineDash(strokeTopDash)
                    context.stroke()
                }
                /* Bottom border */
                if (strokeBottomColor) {
                    context.beginPath()
                    context.moveTo(
                        strokeLeftColor
                            ? -getOffsetFromWidth(strokeLeftWidth)
                            : 0,
                        shape.height() + 0.5
                    )
                    context.lineTo(
                        shape.width() +
                            (strokeRightColor
                                ? getOffsetFromWidth(strokeRightWidth) + 1
                                : 1),
                        shape.height() + 0.5
                    )
                    context.setAttr('lineWidth', strokeBottomWidth)
                    context.setAttr('strokeStyle', strokeBottomColor)
                    context.setAttr('lineCap', lineCap)
                    context.setLineDash(strokeBottomDash)
                    context.stroke()
                }
                /* Left border */
                if (strokeLeftColor) {
                    context.beginPath()
                    context.moveTo(
                        0.5,
                        strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
                    )
                    context.lineTo(
                        0.5,
                        shape.height() +
                            (strokeBottomColor
                                ? getOffsetFromWidth(strokeBottomWidth) + 1
                                : 1)
                    )
                    context.setAttr('strokeStyle', strokeLeftColor)
                    context.setAttr('lineWidth', strokeLeftWidth)
                    context.setAttr('lineCap', lineCap)
                    context.setLineDash(strokeLeftDash)
                    context.stroke()
                }
                /* Right border */
                if (strokeRightColor) {
                    context.beginPath()
                    context.moveTo(
                        shape.width() + 0.5,
                        strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
                    )
                    context.lineTo(
                        shape.width() + 0.5,
                        shape.height() +
                            (strokeBottomColor
                                ? getOffsetFromWidth(strokeBottomWidth) + 1
                                : 1)
                    )
                    context.setAttr('strokeStyle', strokeRightColor)
                    context.setAttr('lineWidth', strokeRightWidth)
                    context.setAttr('lineCap', lineCap)
                    context.setLineDash(strokeRightDash)
                    context.stroke()
                }
            }}
        />
    )
})

export { CellOverlay }
