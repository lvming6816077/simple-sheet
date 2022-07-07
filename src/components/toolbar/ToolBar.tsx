import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

import { MouseEventStoreContext } from "@/stores/MouseEventStore";
import styles from "./styles.module.css";
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from "@/stores/CellStore";
import { ToolBarStoreContext } from "@/stores/ToolBarStore";

import { getCurrentCellByXY, getCurrentCellsByArea } from "@/utils";
import _ from 'lodash'
import ColorPanel from "./components/ColorPanel";
import { cellDash } from "@/utils/constants";

interface IProps {
    swidth: number;
    sheight: number;
}

const ToolBar = (props: any) => {

    const cellStore = useContext(CellStoreContext)
    const toolbarStore = useContext(ToolBarStoreContext)

    const mergeCell = () => {
        toolbarStore.mergeCell(cellStore)
    }

    const colorCell = (color:string)=>{
        toolbarStore.colorBorderCell(color,cellStore)
    }

    const borderStyleCell = (style:string)=>{
        toolbarStore.dashBorderCell(cellDash[style],cellStore)
    }

    const toggleBorderCell = (flag:boolean)=>{
        toolbarStore.toggleBorderCell(flag,cellStore)
    }

    return (
        <div
            className={styles['tool-bar-wrap']}
        >
            <div className={styles['btn-wrap']}>
                <div className={styles['merge-cell']} onClick={mergeCell}></div>
            </div>
            <Menu
                menuClassName="border-menu"
                
                menuButton={<div className={styles['btn-wrap']}>
                    <div className={styles['border']}></div>
                </div>}
            >
                <MenuItem onClick={()=>toggleBorderCell(true)}><div className={styles['border-item']}><div className={styles['item-icon-all']}></div><div className={styles['item-text']}>所有框线</div></div></MenuItem>
                <MenuItem onClick={()=>toggleBorderCell(false)}><div className={styles['border-item']}><div className={styles['item-icon-none']}></div><div className={styles['item-text']}>无框线</div></div></MenuItem>
            </Menu>


            <Menu
                menuClassName="border-menu"
                menuButton={<div className={styles['btn-wrap']}>
                    <div className={styles['border-style']}></div>
                </div>}
            >
                <MenuItem onClick={()=>borderStyleCell('solid')}><div  className={styles['border-style-item']} style={{borderBottom:'2px solid #000'}}></div></MenuItem>
                <MenuItem onClick={()=>borderStyleCell('dashed')}><div onClick={()=>borderStyleCell('dashed')} className={styles['border-style-item']}  style={{borderBottom:'2px dashed #000'}}></div></MenuItem>
                <MenuItem onClick={()=>borderStyleCell('dotted')}><div onClick={()=>borderStyleCell('dotted')} className={styles['border-style-item']}  style={{borderBottom:'2px dotted #000'}}></div></MenuItem>
                
                
            </Menu>
            <Menu
                menuClassName="border-menu"
                menuButton={<div className={styles['btn-wrap']}>
                    <div className={styles['border-color']}></div>
                </div>}
            >
                <MenuItem disabled>
                    <ColorPanel getColor={colorCell}></ColorPanel>
                
                </MenuItem>
                
                
            </Menu>
        </div>
    )
};

export default observer(ToolBar);
