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

interface IProps {
    swidth: number
    sheight: number
}

const ScrollArea = (props: IProps) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'hidden',
                width: props.swidth,
                height: props.sheight,
            }}
        ></div>
    )
}

export default ScrollArea
