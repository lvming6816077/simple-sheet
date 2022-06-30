import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";



const LeftCell = React.memo((props:any) => {
    let {
        x = 0,
        y = 0,
        width,
        height,
        ownKey,
        fill = "#f8f9fa",
        strokeWidth = 1.5,
        stroke = "#c6c6c6",
        align = "center",
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
    } = props;

    // const width = 60,height = 20

    let text = ownKey.split(':')[0]



    const textStyle = `${fontWeight} ${fontStyle}`;

    return (
        <Group>
            <Rect
                stroke={stroke}
                strokeWidth={strokeWidth}
                x={x+0.5}
                y={y+0.5}
                height={height}
                width={width}
                fill={fill}
            ></Rect>
            <Text
                    x={x+0.5}
                    y={y+0.5}
                    height={height}
                    width={width}
                    text={text}
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
        </Group>
    );
});

export default LeftCell;
