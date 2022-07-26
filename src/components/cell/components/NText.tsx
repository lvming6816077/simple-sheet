// import { CellStoreContext } from '@/stores/CellStore'
// import { ToolBarStoreContext } from '@/stores/ToolBarStore'
import { normalCell } from '@/utils/constants'
import { observer } from 'mobx-react-lite'
import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import { Stage, Text, Group, Rect, Shape } from 'react-konva'

interface IProps {}

export const isNull = (value: any) =>
    value === void 0 || value === null || value === ''

const NText = React.memo((props: any) => {
    const {
        x = 0,
        y = 0,
        width,
        height,
        align = 'left',
        verticalAlign = 'middle',
        textColor = '#333',
        padding = 5,
        fontFamily = normalCell.fontFamily,
        fontSize = normalCell.fontSize,
        wrap = 'none',
        type = 'normal',
        ownKey,
        value,
        fontStyle,
        textDecoration,
        isMerge,
    } = props

    return (
        <>
            {/* <!--展位边框--> */}
            {isMerge ? (
                <Rect
                    stroke={'#d9d9d9'}
                    strokeWidth={0.5}
                    x={x}
                    y={y}
                    // sceneFunc={(context) => {
                    //     // context.clearRect(0,0,width,height)

                    //     context.beginPath();
                    //     // debugger
                    //     context.moveTo(0, 0)
                    //     context.lineTo(width, 0);
                    //     context.setAttr('strokeStyle', '#d9d9d9')
                    //     context.setAttr('lineWidth', 2.5)
                    //     context.stroke()
                    //     context.beginPath();
                    //     // debugger
                    //     context.moveTo(width, 0)
                    //     // context.moveTo(width, 0)
                    //     context.lineTo(width, height);
                    //     // context.lineTo(0, height);
                    //     // context.lineTo(0,0);
                    //     // context.lineTo(x, y);
                    //     context.setAttr('strokeStyle', '#d9d9d9')
                    //     context.setAttr('lineWidth', 2.5)
                    //     context.stroke()
                    // }}
                    height={height}
                    ownKey={ownKey}
                    type={type}
                    width={width}
                ></Rect>
            ) : null}

            {isNull(value) ? null : (
                <Text
                    ownKey={ownKey}
                    type={type}
                    x={x}
                    y={y}
                    height={height}
                    width={width}
                    text={value}
                    fill={textColor}
                    verticalAlign={verticalAlign}
                    align={align}
                    fontFamily={fontFamily}
                    fontStyle={fontStyle}
                    textDecoration={textDecoration}
                    padding={padding}
                    wrap={wrap}
                    fontSize={fontSize}
                />
            )}
        </>
    )
})

export default NText
