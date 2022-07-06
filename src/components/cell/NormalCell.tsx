import { CellStoreContext } from "@/stores/CellStore";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";
import HeaderCell from "./HeaderCell";
import LeftCell from "./LeftCell";
import SingleCell from "./SingleCell";

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

export const isNull = (value:any) =>
    value === void 0 || value === null || value === "";

const Cell = React.memo(((props:any) => {
    const {
        x = 0,
        y = 0,
        width,
        height,
        fill = "white",
        strokeWidth = 1,
        stroke = "#d9d9d9",
        align = "left",
        verticalAlign = "middle",
        textColor = "#333",
        padding = 5,
        fontFamily = "Arial",
        fontSize = 12,
        children,
        wrap = "none",
        fontWeight = "normal",
        fontStyle = "normal",
        textDecoration,
        alpha = 1,
        strokeEnabled = true,
        globalCompositeOperation = "multiply",
        isOverlay,
        type = 'normal',
        ownKey,
        ismerge,
        value,
    } = props;


    const cellStore = useContext(CellStoreContext)
    const cellsMap = cellStore.cellsMap
    // console.log(cellsMap['9:6'])

    var mergeRect:any = {}

    if (ismerge) {
        const [firstkey,endkey] = ismerge
        if (ownKey == endkey) {
            mergeRect =  {
                x:cellsMap[firstkey]!.x,
                y:cellsMap[firstkey]!.y,
                width:cellsMap[endkey]!.x-cellsMap[firstkey]!.x+cellsMap[endkey]!.width,
                height:cellsMap[endkey]!.y-cellsMap[firstkey]!.y+cellsMap[endkey]!.height,
            }
            // _value = cellsMap[firstkey]?.value
            // console.log(mergeRect)
        }

    }



    const fillEnabled = !!fill;
    const textStyle = `${fontWeight} ${fontStyle}`;
    const _merge = (ismerge && ismerge[0] != ownKey)
    // if ('9:6' == ownKey) {
    //     console.log(height,ownKey)
    // }
    // console.log(ownKey)

    // console.log(value)
    
    return (
        <Group>
            <Rect
                x={x+0}
                y={y+0}
                ownKey={ownKey}
                height={height}
                width={width}
                fill={fill}
                stroke={stroke}
                type={type}
                // strokeWidth={strokeWidth}

                strokeWidth={ismerge ? 0: 0.5}
                ismerge={ismerge}
                shadowForStrokeEnabled={false}
                strokeScaleEnabled={true}
                hitStrokeWidth={0}
                alpha={alpha}
                fillEnabled={fillEnabled}
                strokeEnabled={strokeEnabled}
            />
  
            {(isNull(value) || mergeRect.width) ? null : (
                <Text
                    ownKey={ownKey}
                    x={x+0}
                    y={y+0}
                    height={height}
                    type={type}
                    width={width}
                    text={value}
                    fill={textColor}
                    ismerge={ismerge}
                    lineHeight={1.5}
                    verticalAlign={verticalAlign}
                    align={align}
                    fontFamily={fontFamily}
                    fontStyle={textStyle}
                    textDecoration={textDecoration}
                    padding={padding}
                    wrap={wrap}
                    fontSize={fontSize}
                    hitStrokeWidth={0}
                />
            )}
                    {mergeRect.width ? <Text
                    ownKey={ownKey}
                    type={type}
                    x={mergeRect.x}
                    y={mergeRect.y}
                    height={mergeRect.height}
                    width={mergeRect.width}
                    text={value}
                    fill={'red'}
                    // lineHeight={mergeRect.height}
                    verticalAlign={verticalAlign}
                    align={align}
                    fontFamily={fontFamily}
                    fontStyle={textStyle}
                    textDecoration={textDecoration}
                    padding={padding}
                    wrap={wrap}
                    fontSize={fontSize}
                    hitStrokeWidth={0}
                />:null}
        </Group>
    );
}));

export default Cell;
