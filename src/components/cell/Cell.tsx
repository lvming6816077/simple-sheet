import { CellStoreContext } from "@/stores/CellStore";
import { observer } from "mobx-react-lite";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Stage, Text, Group, Rect } from "react-konva";
import HeaderCell from "./HeaderCell";
import LeftCell from "./LeftCell";
import NormalCell from "./NormalCell";
import SingleCell from "./SingleCell";

interface IProps {

}



const Cell = React.memo(((props:any) => {
    const {
        type = 'normal',
    } = props;


    if (type == 'normal') return <NormalCell {...props}></NormalCell>
    if (type == 'header') return <HeaderCell {...props}></HeaderCell>
    if (type == 'left') return <LeftCell {...props}></LeftCell>
    if (type == 'single') return <SingleCell {...props}></SingleCell>
    return null;
}));

export default Cell;
