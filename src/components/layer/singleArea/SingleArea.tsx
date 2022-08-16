import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import styles from './styles.module.css'
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from '@/stores/CellStore'
import { getCurrentCellByXY } from '@/utils'
import _ from 'lodash'
import { headerCell, leftCell, singleCell } from '@/utils/constants'

const SingleArea = () => {
    const cellStore = useContext(CellStoreContext)
    const selectArea = cellStore.selectArea
    const activeCell = cellStore.activeCell


    return (
        <div
            className={'single-area'}
            onClick={()=>cellStore.areaAllCell()}
            style={{
                position: 'absolute',
                left: 1,
                top: 1,
                width: singleCell.width-1,
                height: singleCell.height-1,
                cursor:'pointer',
                background:'#fff',
                pointerEvents:'auto',
            }}
        >
            <div className={styles['right-bottom-triangle']}></div>

        </div>
    )
}

export default observer(SingleArea)
