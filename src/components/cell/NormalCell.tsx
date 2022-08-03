import { CellStoreContext } from '@/stores/CellStore'
import { ToolBarStoreContext } from '@/stores/ToolBarStore'
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

import { Stage, Text, Group, Rect } from 'react-konva'
import NImage from './components/NImage'
import NText from './components/NText'
import HeaderCell from './HeaderCell'
import LeftCell from './LeftCell'
import SingleCell from './SingleCell'

interface IProps {}

const Cell = React.memo((props: any) => {
    const {
        x = 0,
        y = 0,
        width,
        height,
        fill = normalCell.fill,
        strokeWidth = 1,
        stroke = '#d9d9d9',
        align = 'left',
        verticalAlign = 'middle',
        textColor = '#333',
        padding = 5,
        fontFamily = normalCell.fontFamily,
        fontSize = normalCell.fontSize,
        wrap = 'none',
        alpha = 1,
        strokeEnabled = true,
        type = 'normal',
        ownKey,
        isMerge,
        value,
        imgUrl,
        imgLoaded,
    } = props

    const cellStore = useContext(CellStoreContext)
    const cellsMap = cellStore.cellsMap

    const tabBarStore = useContext(ToolBarStoreContext)

    const fontWeight = tabBarStore.currentTextFillBold ? 'bold' : ''
    const fontItalic = tabBarStore.currentTextFillItalic ? 'italic' : ''

    const fontStyle = (fontItalic + ' ' + fontWeight).trim() || 'normal'

    const textDecoration = tabBarStore.currentTextFillUnderline

    // console.log(props)

    var mergeRect: any = {}

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
        }
    }

    const renderCell = () => {
        var p = {
            ownKey: ownKey,
            type: type,
            x: x,
            y: y,
            height: height,
            width: width,
            value: value,
            fill: textColor,
            textColor:textColor,
            verticalAlign: verticalAlign,
            align: align,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            padding: padding,
            wrap: wrap,
            fontSize: fontSize,
            imgUrl: imgUrl,
            imgLoaded: imgLoaded,
        }

        if (mergeRect.width) {
            p.width = mergeRect.width
            p.height = mergeRect.height
            p.x = mergeRect.x
            p.y = mergeRect.y
            if (imgUrl) {
                return <NImage {...p}></NImage>
            } else {
                return <NText {...p} isMerge={isMerge}></NText>
            }
        } else {
            if (imgUrl) {
                return <NImage {...p}></NImage>
            } else {
                return <NText {...p}></NText>
            }
        }
    }

    return (
        <Group>
            <Rect
                x={x + 0}
                y={y + 0}
                ownKey={ownKey}
                height={height}
                width={width}
                fill={fill}
                stroke={stroke}
                type={type}
                strokeWidth={isMerge ? 0 : 0.5}
                isMerge={isMerge}
                alpha={alpha}
            />
            {renderCell()}
        </Group>
    )
})

export default Cell
