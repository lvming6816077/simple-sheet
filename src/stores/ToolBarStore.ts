import { observable, action, computed } from 'mobx'
import { createContext } from 'react'
import _ from 'lodash'

import {
    getCurrentCellsByArea,
    getCurrentCellByOwnKey,
    getCurrentCellByXY,
    getCellsByMergeKey,
} from '@/utils'

import {
    BorderStyle,
    CellAttrs,
    CellMap,
    CellStore,
    CellStoreContext,
    SelectArea,
} from './CellStore'
import { defaultBorderStyle } from '@/utils/constants'

class ToolBarStore {
    @action.bound
    mergeCell(cellStore: CellStore) {
        let cells = getCurrentCellsByArea(
            cellStore.selectArea,
            cellStore.cellsMap
        )

        cellStore.mergeCell(cells)
        let first = cells[0]
        let last = cells[cells.length - 1]

        // first!.width = last!.x - first!.x + last!.width
        // first!.height = last!.y - first!.y + last!.height
        // cells.forEach(i=>{
        //     i!.fill = 'red'
        // })

        cellStore.setActiveCell({
            ...first,
            width: last!.x - first!.x + last!.width,
            height: last!.y - first!.y + last!.height,
        } as CellAttrs)

        cellStore.setSelectArea(null)
    }

    @action.bound
    splitCell(cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )

            cellStore.splitCell(cells)
        } else if (cellStore.activeCell && cellStore.activeCell.ismerge) {
            let cells = getCellsByMergeKey(
                cellStore.activeCell.ismerge,
                cellStore.cellsMap
            )
            cellStore.splitCell(cells)
        }
    }

    dealWithBorderStyle(obj: BorderStyle, cellStore: CellStore, hide = false) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                i!.borderStyle = hide
                    ? undefined
                    : {
                          ...i!.borderStyle,
                          ...obj,
                      }
            })
        } else if (cellStore.activeCell) {
            let cell = getCurrentCellByOwnKey(
                cellStore.activeCell.ownKey,
                cellStore.cellsMap
            )
            cell!.borderStyle = hide
                ? undefined
                : {
                      ...cell!.borderStyle,
                      ...obj,
                  }
        }
    }

    @action.bound
    colorBorderCell(color: string, cellStore: CellStore) {
        this.dealWithBorderStyle(
            { color: color, strokeDash: this.currentBorderStyle?.strokeDash },
            cellStore
        )
        this.currentBorderStyle = {
            ...this.currentBorderStyle,
            color: color,
        }
    }

    @action.bound
    dashBorderCell(dash: number[], cellStore: CellStore) {
        this.dealWithBorderStyle(
            { strokeDash: dash, color: this.currentBorderStyle?.color },
            cellStore
        )
        this.currentBorderStyle = {
            ...this.currentBorderStyle,
            strokeDash: dash,
        }
    }

    @observable
    currentBorderStyle: BorderStyle = defaultBorderStyle

    @action.bound
    toggleBorderCell(flag: boolean, cellStore: CellStore) {
        this.dealWithBorderStyle(this.currentBorderStyle, cellStore, !flag)

        if (flag == false) {
            this.currentBorderStyle = defaultBorderStyle
        }
    }

    @action.bound
    fillCell(color: string, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                i!.fill = color
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cells = getCellsByMergeKey(ismerge, cellStore.cellsMap)
                cellStore.fillCell(color, cells)
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )
                cell!.fill = color
            }
        }
    }

    @observable
    currentTextFillBold: boolean | string = false

    @action.bound
    textBoldCell(cellStore: CellStore) {
        if (this.currentTextFillBold) {
            this.currentTextFillBold = false
        } else {
            this.currentTextFillBold = 'bold'
        }
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            if (this.currentTextFillBold) {
                cells.forEach((i) => {
                    i!.fontWeight = 'bold'
                })
            } else {
                cells.forEach((i) => {
                    i!.fontWeight = false
                })
            }
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            let cell = null
            if (ismerge) {
                cell = getCurrentCellByOwnKey(ismerge[1], cellStore.cellsMap)
            } else {
                cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )
            }
            cell!.fontWeight = this.currentTextFillBold ? 'bold' : false
        }
    }

    @action.bound
    textColorCell(color: string, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                if (i?.value) {
                    i!.textColor = color
                }
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cell = getCurrentCellByOwnKey(
                    ismerge[1],
                    cellStore.cellsMap
                )
                cell!.textColor = color
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )

                cell!.textColor = color
            }
        }
    }

    @action.bound
    verticalAlignCell(align: string, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                if (i?.value) {
                    i!.verticalAlign = align
                }
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cell = getCurrentCellByOwnKey(
                    ismerge[1],
                    cellStore.cellsMap
                )
                cell!.verticalAlign = align
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )

                cell!.verticalAlign = align
            }
        }
    }

    @action.bound
    alignCell(align: string, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                if (i?.value) {
                    i!.align = align
                }
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cell = getCurrentCellByOwnKey(
                    ismerge[1],
                    cellStore.cellsMap
                )
                cell!.align = align
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )

                cell!.align = align
            }
        }
    }

    @action.bound
    fontFamaiyCell(str: string, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                if (i?.value) {
                    i!.fontFamily = str
                }
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cell = getCurrentCellByOwnKey(
                    ismerge[1],
                    cellStore.cellsMap
                )
                cell!.fontFamily = str
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )

                cell!.fontFamily = str
            }
        }
    }

    @action.bound
    fontSizeCell(size: number, cellStore: CellStore) {
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            cells.forEach((i) => {
                if (i?.value) {
                    i!.fontSize = size
                }
            })
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            if (ismerge) {
                let cell = getCurrentCellByOwnKey(
                    ismerge[1],
                    cellStore.cellsMap
                )
                cell!.fontSize = size
            } else {
                let cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )

                cell!.fontSize = size
            }
        }
    }

    @observable
    currentTextFillItalic: boolean | string = false

    @action.bound
    textItalicCell(cellStore: CellStore) {
        if (this.currentTextFillItalic) {
            this.currentTextFillItalic = false
        } else {
            this.currentTextFillItalic = 'italic'
        }
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            if (this.currentTextFillItalic) {
                cells.forEach((i) => {
                    i!.fontItalic = 'italic'
                })
            } else {
                cells.forEach((i) => {
                    i!.fontItalic = false
                })
            }
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            let cell = null
            if (ismerge) {
                cell = getCurrentCellByOwnKey(ismerge[1], cellStore.cellsMap)
            } else {
                cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )
            }
            cell!.fontItalic = this.currentTextFillItalic ? 'bold' : false
        }
    }

    @observable
    currentTextFillUnderline: string = ''

    @action.bound
    textUnderlineCell(cellStore: CellStore) {
        if (this.currentTextFillUnderline) {
            this.currentTextFillUnderline = ''
        } else {
            this.currentTextFillUnderline = 'underline'
        }
        if (cellStore.selectArea) {
            let cells = getCurrentCellsByArea(
                cellStore.selectArea,
                cellStore.cellsMap
            )
            if (this.currentTextFillUnderline) {
                cells.forEach((i) => {
                    i!.textDecoration = 'underline'
                })
            } else {
                cells.forEach((i) => {
                    i!.textDecoration = ''
                })
            }
        } else if (cellStore.activeCell) {
            var ismerge = cellStore.activeCell.ismerge
            let cell = null
            if (ismerge) {
                cell = getCurrentCellByOwnKey(ismerge[1], cellStore.cellsMap)
            } else {
                cell = getCurrentCellByOwnKey(
                    cellStore.activeCell.ownKey,
                    cellStore.cellsMap
                )
            }
            cell!.textDecoration = this.currentTextFillUnderline
                ? 'underline'
                : ''
        }
    }

    //   @computed
    //   get getcells() {

    //   }
}

export const ToolBarStoreContext = createContext(new ToolBarStore())
