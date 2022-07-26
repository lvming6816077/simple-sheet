import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import styles from './styles.module.css'
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from '@/stores/CellStore'
import { getCurrentCellByXY } from '@/utils'
import _ from 'lodash'
import { headerCell, leftCell } from '@/utils/constants'
import { ControlledMenu, Menu, MenuItem, useMenuState } from '@szhsin/react-menu'

interface IProps {
    swidth?: number
    sheight?: number
}

const ContextMenuLayer = (props: IProps) => {


    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [menuProps, toggleMenu] = useMenuState(); 
    const mouseEventStore = useContext(MouseEventStoreContext)
    const rc = mouseEventStore.rcCellAttr
    useEffect(()=>{
        if (!rc) return
        setAnchorPoint({ x: rc.clientX, y: rc.clientY });
        toggleMenu(true)
    },[rc])
    return (
        <div
            style={{
                position: 'absolute',
                left: -leftCell.width,
                top: -headerCell.height,
                overflow: 'hidden',
                bottom: 0,
                right: 0,
            }}
        >          <ControlledMenu {...menuProps} anchorPoint={anchorPoint} menuClassName="border-menu"
        onClose={() => toggleMenu(false)}>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
    </ControlledMenu></div>
    )
}

export default observer(ContextMenuLayer)
