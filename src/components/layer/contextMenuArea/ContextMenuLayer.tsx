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
import { getCurrentCellByOwnKey, getCurrentCellByXY } from '@/utils'
import _ from 'lodash'
import { headerCell, leftCell } from '@/utils/constants'
import {
    ControlledMenu,
    Menu,
    MenuDivider,
    MenuItem,
    useMenuState,
} from '@szhsin/react-menu'
import { CopyStoreContext } from '@/stores/CopyStore'

interface IProps {}

const ContextMenuLayer = (props: IProps) => {
    const cellStore = useContext(CellStoreContext)
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
    const [menuProps, toggleMenu] = useMenuState()
    const mouseEventStore = useContext(MouseEventStoreContext)
    const rc = mouseEventStore.rcCellAttr
    const copyStore = useContext(CopyStoreContext)
    useEffect(() => {
        if (!rc) return

        setAnchorPoint({ x: rc.clientX, y: rc.clientY })
        toggleMenu(true)
    }, [rc])

    const addRow = (type: string) => {
        let cur = getCurrentCellByOwnKey(rc!.ownKey, cellStore.cellsMap, true)

        if (type == 'up') {
        } else {
            cellStore.addCellRowBelow(cur!.ownKey)
        }
    }
    const addCol = (type: string) => {
        let cur = getCurrentCellByOwnKey(rc!.ownKey, cellStore.cellsMap, true)

        if (type == 'right') {
            cellStore.addCellRowRight(cur!.ownKey)
        } else {
        }
    }

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
        >
            {' '}
            <ControlledMenu
                {...menuProps}
                anchorPoint={anchorPoint}
                menuClassName="border-menu"
                onClose={() => toggleMenu(false)}
            >
                <MenuItem disabled={true}>剪切（Ctrl+X）</MenuItem>
                <MenuItem onClick={()=>copyStore.copyCurrentCells(cellStore)}>复制（Ctrl+C）</MenuItem>
                <MenuItem onClick={()=>copyStore.pasteCurrentCells(cellStore)}>粘贴（Ctrl+V）</MenuItem>
                <MenuDivider />
                {/* <MenuItem>
                    <div className={styles['border-item']} onClick={()=>addRow('up')}>
                        <div
                            className={`${styles['item-icon-insert-1']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>插入一行（上）</div>
                    </div>
                
                </MenuItem> */}
                <MenuItem>
                    <div
                        className={styles['border-item']}
                        onClick={() => addRow('below')}
                    >
                        <div
                            className={`${styles['item-icon-insert-2']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>
                            插入一行（下）
                        </div>
                    </div>
                </MenuItem>
                {/* <MenuItem>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-insert-3']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>插入一列（左）</div>
                    </div>
                
                </MenuItem> */}
                <MenuItem>
                    <div
                        className={styles['border-item']}
                        onClick={() => addCol('right')}
                    >
                        <div
                            className={`${styles['item-icon-insert-4']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>
                            插入一列（右）
                        </div>
                    </div>
                </MenuItem>
            </ControlledMenu>
        </div>
    )
}

export default observer(ContextMenuLayer)
