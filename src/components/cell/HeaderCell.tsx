import { CellAttrs, CellStoreContext } from '@/stores/CellStore'
import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import { headerCell } from '@/utils/constants'
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

import { Stage, Text, Group, Rect, Line } from 'react-konva'
import DraggableRect from './DraggableRect'

const HeaderCell = React.memo((props: any) => {
    let {
        width,
        height,
        ownKey,
        fill = headerCell.fill,
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

    let text = String.fromCharCode(Number(ownKey.split(':')[1]) + 64)

    const cellStore = useContext(CellStoreContext)

    // const dv = mouseEventStore.getdownCellAttr
    // const mv = mouseEventStore.moveCellAttr
    // const uv = mouseEventStore.upCellAttr
    // const isSelecting = useRef(false);
    // const selectStart = useRef<CellAttrs>(null);
    // useEffect(()=>{
    //     if (!dv) return
    //     isSelecting.current = true

    //     selectStart.current = dv ? {
    //         x:dv.x,
    //         y:dv.y
    //     } : null
    //     // console.log(x,y)
    //     if (dv.x == x) {
    //         setOwnFill('blue')
    //     } else {
    //         setOwnFill(fill)
    //     }
    // },[dv])
    // // console.log('xxx')
    // useEffect(()=>{
    //     if (isSelecting.current && mv) {

    //         const cur = {
    //             x:mv.x,
    //             y:mv.y
    //         }
    //         const start = selectStart.current

    //         if (start == null) return

    //         let top = Math.min(start.y, cur.y);
    //         let bottom = Math.max(start.y, cur.y);
    //         let left = Math.min(start.x, cur.x);
    //         let right = Math.max(start.x, cur.x);

    //         if (x <= right && x>=left) {
    //             setOwnFill('blue')
    //         } else {
    //             setOwnFill(fill)
    //         }
    //     }
    // },[mv])

    // useEffect(()=>{
    //     if (isSelecting.current && uv) {
    //         isSelecting.current = false

    //     }
    // },[uv])

    const textStyle = `${fontWeight} ${fontStyle}`

    const isFirst = ownKey == '0:1'
    const dragHandleWidth = 3

    const clickHeader = () => {
        console.log(ownKey)
        cellStore.areaHeaderCell(ownKey)
    }

    return (
        <>
            <Rect
                stroke={stroke}
                strokeWidth={0.5}
                x={x}
                y={y}
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
                onClick={clickHeader}
                onMouseEnter={(e) => {
                    document.body.style.cursor = 'pointer'
                }}
                onMouseLeave={(e) => {
                    document.body.style.cursor = 'default'
                }}
                verticalAlign={verticalAlign}
                align={align}
                fontFamily={fontFamily}
                fontStyle={textStyle}
                textDecoration={textDecoration}
                padding={padding}
                wrap={wrap}
                fontSize={fontSize}
                hitStrokeWidth={0}
                type={type}
            />

            <DraggableRect
                {...props}
                x={x - dragHandleWidth + width}
                y={y}
                height={height}
                width={dragHandleWidth}
                ownx={props.x}
            ></DraggableRect>
        </>
    )
})

export default HeaderCell
