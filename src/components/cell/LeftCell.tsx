import { CellStoreContext } from '@/stores/CellStore'
import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { dragHandleHeight, leftCell } from '@/utils/constants'
import { observer } from 'mobx-react-lite'
import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import { Stage, Text, Group, Rect } from 'react-konva'
import DraggableRect from './DraggableRect'

const LeftCell = React.memo((props: any) => {
    let {
        width,
        height,
        ownKey,
        fill = leftCell.fill,
        strokeWidth = 1.5,
        stroke = '#c6c6c6',
        align = 'center',
        verticalAlign = 'middle',
        textColor = '#333',
        padding = 5,
        fontFamily = 'Arial',
        fontSize = 12,
        children,
        wrap = 'none',
        fontWeight = 'normal',
        fontStyle = 'normal',
        textDecoration,
        alpha = 1,
        strokeEnabled = true,
        globalCompositeOperation = 'multiply',
        type,
    } = props

    let x = props.x + 0,
        y = props.y + 0

    const cellStore = useContext(CellStoreContext)

    let text = ownKey.split(':')[0]

    const textStyle = `${fontWeight} ${fontStyle}`

    const clickHeader = () => {
        cellStore.areaLeftCell(ownKey)
    }

    return (
        <>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x}
                y={y}
                type={type}
                height={height}
                width={width}
                fill={fill}
            ></Rect>
            <Text
                x={x}
                y={y}
                height={height}
                width={width}
                text={text}
                fill={textColor}
                verticalAlign={verticalAlign}
                align={align}
                onClick={clickHeader}
                onMouseEnter={(e) => {
                    document.body.style.cursor = 'pointer'
                }}
                onMouseLeave={(e) => {
                    document.body.style.cursor = 'default'
                }}
                fontFamily={fontFamily}
                fontStyle={textStyle}
                textDecoration={textDecoration}
                padding={padding}
                wrap={wrap}
                type={type}
                fontSize={fontSize}
                hitStrokeWidth={0}
            />
            <DraggableRect
                {...props}
                x={x}
                y={y - dragHandleHeight + height}
                height={dragHandleHeight}
                width={width}
                owny={props.y}
            ></DraggableRect>
        </>
    )
})

export default LeftCell
