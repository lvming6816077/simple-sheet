import { CellStore, CellStoreContext } from '@/stores/CellStore'
import { getScrollWidthAndHeight } from '@/utils'
import { useEffect, useState, useRef, useMemo, useContext } from 'react'

// canvas实时大小
export const useSize = () => {
    const cellStore = useContext(CellStoreContext)
    let { swidth, sheight } = useMemo(
        () =>
            getScrollWidthAndHeight(
                cellStore.cellsMap,
                cellStore.rowStopIndex,
                cellStore.columnStopIndex
            ),
        [cellStore.cellsMap, cellStore.rowStopIndex, cellStore.columnStopIndex]
    )

    return { swidth, sheight }
}
