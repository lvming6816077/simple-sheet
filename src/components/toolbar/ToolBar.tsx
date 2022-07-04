import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";


import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from "@/stores/CellStore";
import { ToolBarStoreContext } from "@/stores/ToolBarStore";

import { getCurrentCellByXY, getCurrentCellsByArea } from "@/utils";
import _ from 'lodash'

interface IProps {
    swidth: number;
    sheight: number;
}

const ToolBar = (props: any) => {

    const cellStore = useContext(CellStoreContext)
    const toolbarStore = useContext(ToolBarStoreContext)

    const mergeCell = ()=>{
        toolbarStore.mergeCell(cellStore)
    }

    return (
        <div
            className={styles['tool-bar-wrap']}
            style={{
            }}
        >
            <div className={styles['merge-cell']} onClick={mergeCell}></div>
        </div>
    )
};

export default observer(ToolBar);
