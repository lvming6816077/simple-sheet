import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";
import HeaderCell from "./HeaderCell";
import LeftCell from "./LeftCell";

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

const Cell = React.memo(observer((props:any) => {
    const {
        x = 0,
        y = 0,
        width,
        height,
        value,
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
        ownKey
    } = props;

    const fillEnabled = !!fill;
    const textStyle = `${fontWeight} ${fontStyle}`;
    if (type == 'header') return <HeaderCell {...props}></HeaderCell>
    if (type == 'left') return <LeftCell {...props}></LeftCell>
    if (type == 'single') return <Rect {...props}></Rect>
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
                // strokeWidth={strokeWidth}
                
                strokeWidth={0.5}
                shadowForStrokeEnabled={false}
                strokeScaleEnabled={true}
                hitStrokeWidth={0}
                alpha={alpha}
                fillEnabled={fillEnabled}
                strokeEnabled={strokeEnabled}
            />
            {isNull(value) ? null : (
                <Text
                    ownKey={ownKey}
                    x={x+0}
                    y={y+0}
                    height={height}
                    width={width}
                    text={value}
                    fill={textColor}
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
            {children}
        </Group>
    );
}));

export default Cell;
