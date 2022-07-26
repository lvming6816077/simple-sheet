import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

// import { MouseEventStoreContext } from '@/stores/MouseEventStore'
import ReactTooltip from 'react-tooltip'
import styles from './styles.module.css'
import { observer } from 'mobx-react-lite'
import { CellAttrs, CellStoreContext } from '@/stores/CellStore'
// import { ToolBarStoreContext } from '@/stores/ToolBarStore'

import _ from 'lodash'
import ColorPanel from './components/ColorPanel'
import { cellDash, floatImageStyle, normalCell } from '@/utils/constants'
import Konva from 'konva'
import { getScrollWidthAndHeight } from '@/utils'
import { ToolBarStoreContext } from '@/stores/ToolBarStore'
import { FloatImageStoreContext } from '@/stores/FloatImageStore'

interface IProps {
    stageRef: React.MutableRefObject<Konva.Stage | null>
}

const ToolBar = (props: IProps) => {
    const cellStore = useContext(CellStoreContext)
    const toolbarStore = useContext(ToolBarStoreContext)
    const floatImageStore = useContext(FloatImageStoreContext)

    const mergeCell = () => {
        toolbarStore.mergeCell(cellStore)
    }
    const splitCell = () => {
        toolbarStore.splitCell(cellStore)
    }

    const colorCell = (color: string) => {
        toolbarStore.colorBorderCell(color, cellStore)
    }

    const borderStyleCell = (style: string) => {
        toolbarStore.dashBorderCell(cellDash[style], cellStore)
    }

    const toggleBorderCell = (flag: boolean) => {
        toolbarStore.toggleBorderCell(flag, cellStore)
    }
    const fillCell = (color: string) => {
        toolbarStore.fillCell(color, cellStore)
    }

    const textBoldCell = () => {
        toolbarStore.textBoldCell(cellStore)
    }
    const textItalicCell = () => {
        toolbarStore.textItalicCell(cellStore)
    }

    const textUnderLineCell = () => {
        toolbarStore.textUnderlineCell(cellStore)
    }

    const textColorCell = (color: string) => {
        toolbarStore.textColorCell(color, cellStore)
    }

    const [curVA, setCurVA] = useState<string>('middle')
    const verticalAlignCell = (align: string) => {
        setCurVA(align)
        toolbarStore.verticalAlignCell(align, cellStore)
    }
    const getVAlignBtn = () => {
        if (curVA == 'middle') {
            return <div className={styles['cell-v-align-middle']}></div>
        } else if (curVA == 'top') {
            return <div className={styles['cell-v-align-top']}></div>
        } else {
            return <div className={styles['cell-v-align-bottom']}></div>
        }
    }

    const [curA, setCurA] = useState<string>('left')
    const alignCell = (align: string) => {
        setCurA(align)
        toolbarStore.alignCell(align, cellStore)
    }
    const getAlignBtn = () => {
        if (curA == 'center') {
            return <div className={styles['cell-align-center']}></div>
        } else if (curVA == 'left') {
            return <div className={styles['cell-align-left']}></div>
        } else {
            return <div className={styles['cell-align-right']}></div>
        }
    }

    const [curF, setCurF] = useState<string>(normalCell.fontFamily)
    const fontFamilyCell = (str: string) => {
        setCurF(str)
        toolbarStore.fontFamaiyCell(str, cellStore)
    }
    useEffect(() => {
        setCurFS(
            cellStore.activeCell?.fontSize
                ? cellStore.activeCell?.fontSize
                : normalCell.fontSize
        )
        setCurF(
            cellStore.activeCell?.fontFamily
                ? cellStore.activeCell?.fontFamily
                : normalCell.fontFamily
        )
    }, [cellStore.activeCell])

    const [curFS, setCurFS] = useState<number>(normalCell.fontSize)
    const fontSizeCell = (size: number) => {
        setCurFS(size)
        toolbarStore.fontSizeCell(size, cellStore)
    }

    let { swidth, sheight } = useMemo(
        () => getScrollWidthAndHeight(cellStore.cellsMap),
        [cellStore.cellsMap]
    )

    const exportImage = () => {
        function downloadURI(uri: string, name: string) {
            if (!uri) return
            var link = document.createElement('a')
            link.download = name
            link.href = uri
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // delete link;
        }

        var dataURL = props.stageRef.current?.toDataURL({
            x: 0,
            y: 0,
            width: swidth,
            height: sheight,
            pixelRatio: 3,
        })
        downloadURI(dataURL || '', `sheet-${Date.now()}.png`)
    }

    const inputRef = useRef<HTMLInputElement>(null)
    let uploadImgType: string | null = null
    const selecteFileHandler = (event: any) => {
        let file = event.target.files[0]

        var pettern = /^image/

        if (!file) return

        if (!pettern.test(file.type)) {
            alert('图片格式不正确')
            return
        }
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            var base64 = reader.result || ''

            if (uploadImgType == 'local') {
                toolbarStore.uploadImgCell(base64?.toString(), cellStore)
            }
            if (uploadImgType == 'float') {
                let x = floatImageStyle.initX,
                    y = floatImageStyle.initY
                if (cellStore.activeCell) {
                    x = cellStore.activeCell.x
                    y = cellStore.activeCell.y
                }
                floatImageStore.addFloatImage({
                    id: Date.now().toString(),
                    x: x,
                    y: y,
                    width: floatImageStyle.initWidth,
                    height: floatImageStyle.initHeight,
                    imgUrl: base64?.toString(),
                    transformObj: null,
                })
                cellStore.setActiveCell(null)
            }

            inputRef.current!.value = ''
        }
    }

    const uploadImg = (type: string) => {
        uploadImgType = type
        if (type == 'local') {
            inputRef.current?.click()
        } else if (type == 'net') {
            let str = prompt('请输入图片URL地址', '')
            if (str) {
                toolbarStore.uploadImgCell(str, cellStore)
            }
        } else {
            inputRef.current?.click()
        }
    }

    return (
        <div className={`${styles['tool-bar-wrap']}`}>
            <ReactTooltip
                effect="solid"
                place="bottom"
                className="ReactTooltip"
            ></ReactTooltip>

            <div className={styles['btn-wrap']}>
                <div className={styles['back-cell']} data-tip="撤销"></div>
            </div>
            <div className={styles['btn-wrap']}>
                <div className={styles['front-cell']} data-tip="前进"></div>
            </div>

            <div className={styles.divider}></div>

            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="字体">
                        <div className={styles['font-family']}>{curF}</div>
                        <div className={styles.triangle}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => fontFamilyCell('Arial')}>
                    Arial
                </MenuItem>
                <MenuItem onClick={() => fontFamilyCell('Helvetica')}>
                    Helvetica
                </MenuItem>
                <MenuItem onClick={() => fontFamilyCell('Calibri')}>
                    Calibri
                </MenuItem>
                <MenuItem onClick={() => fontFamilyCell('Tahoma')}>
                    Tahoma
                </MenuItem>
                <MenuItem onClick={() => fontFamilyCell('Times')}>
                    Times
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu font-size"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="字号">
                        <div className={styles['font-family']}>{curFS}</div>
                        <div className={styles.triangle}></div>
                    </div>
                }
            >
                {[10, 12, 14, 16, 18, 20, 22, 24].map((i) => (
                    <MenuItem onClick={() => fontSizeCell(i)} key={i}>
                        {i}
                    </MenuItem>
                ))}
            </Menu>

            <div className={styles.divider}></div>

            <Menu
                menuClassName="border-menu no"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="文字颜色">
                        <div className={styles['text-color']}></div>
                    </div>
                }
            >
                <MenuItem>
                    <ColorPanel getColor={textColorCell}></ColorPanel>
                </MenuItem>
            </Menu>
            <div
                className={`${styles['btn-wrap']} ${
                    toolbarStore.currentTextFillBold
                        ? styles['acitve-btn-wrap']
                        : ''
                } `}
            >
                <div
                    className={`${styles['text-bold']}`}
                    onClick={textBoldCell}
                    data-tip="加粗"
                ></div>
            </div>
            <div
                className={`${styles['btn-wrap']} ${
                    toolbarStore.currentTextFillItalic
                        ? styles['acitve-btn-wrap']
                        : ''
                } `}
            >
                <div
                    className={`${styles['text-italic']}`}
                    onClick={textItalicCell}
                    data-tip="斜体"
                ></div>
            </div>
            <div
                className={`${styles['btn-wrap']} ${
                    toolbarStore.currentTextFillUnderline
                        ? styles['acitve-btn-wrap']
                        : ''
                } `}
            >
                <div
                    className={`${styles['text-underline']}`}
                    onClick={textUnderLineCell}
                    data-tip="下划线"
                ></div>
            </div>
            <div className={styles['btn-wrap']}>
                <div
                    className={styles['merge-cell']}
                    onClick={mergeCell}
                    data-tip="合并单元格"
                ></div>
            </div>
            <div className={styles['btn-wrap']}>
                <div
                    className={styles['split-cell']}
                    onClick={splitCell}
                    data-tip="拆分单元格"
                ></div>
            </div>
            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="边框">
                        <div className={styles.border}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => toggleBorderCell(true)}>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-all']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>所有框线</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => toggleBorderCell(false)}>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-none']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>无框线</div>
                    </div>
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="边框线条">
                        <div className={styles['border-style']}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => borderStyleCell('solid')}>
                    <div
                        className={styles['border-style-item']}
                        style={{ borderBottom: '2px solid #000' }}
                    ></div>
                </MenuItem>
                <MenuItem onClick={() => borderStyleCell('dashed')}>
                    <div
                        className={styles['border-style-item']}
                        style={{ borderBottom: '2px dashed #000' }}
                    ></div>
                </MenuItem>
                <MenuItem onClick={() => borderStyleCell('dotted')}>
                    <div
                        className={styles['border-style-item']}
                        style={{ borderBottom: '2px dotted #000' }}
                    ></div>
                </MenuItem>
            </Menu>
            <Menu
                menuClassName="border-menu no"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="边框颜色">
                        <div className={styles['border-color']}></div>
                    </div>
                }
            >
                <MenuItem>
                    <ColorPanel getColor={colorCell}></ColorPanel>
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu no"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="单元格颜色">
                        <div className={styles['paint-fill']}></div>
                    </div>
                }
            >
                <MenuItem>
                    <ColorPanel getColor={fillCell}></ColorPanel>
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="垂直对齐">
                        {getVAlignBtn()}

                        <div className={styles.triangle}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => verticalAlignCell('top')}>
                    <div className={styles['cell-v-align-top']}></div>
                </MenuItem>
                <MenuItem onClick={() => verticalAlignCell('middle')}>
                    <div className={styles['cell-v-align-middle']}></div>
                </MenuItem>
                <MenuItem onClick={() => verticalAlignCell('bottom')}>
                    <div className={styles['cell-v-align-bottom']}></div>
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="水平对齐">
                        {getAlignBtn()}
                        <div className={styles.triangle}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => alignCell('left')}>
                    <div className={styles['cell-align-left']}></div>
                </MenuItem>
                <MenuItem onClick={() => alignCell('center')}>
                    <div className={styles['cell-align-center']}></div>
                </MenuItem>
                <MenuItem onClick={() => alignCell('right')}>
                    <div className={styles['cell-align-right']}></div>
                </MenuItem>
            </Menu>

            <Menu
                menuClassName="border-menu"
                menuButton={
                    <div className={styles['btn-wrap']} data-tip="插入图片">
                        <div className={styles['insert-img']}></div>
                    </div>
                }
            >
                <MenuItem onClick={() => uploadImg('local')}>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-insert-1']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>本地图片</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => uploadImg('net')}>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-insert-2']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>网络图片</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => uploadImg('float')}>
                    <div className={styles['border-item']}>
                        <div
                            className={`${styles['item-icon-insert-2']} ${styles['icon-item']}`}
                        ></div>
                        <div className={styles['item-text']}>浮动图片</div>
                    </div>
                </MenuItem>
            </Menu>
            <input
                type="file"
                onChange={selecteFileHandler}
                ref={inputRef}
                style={{ display: 'none' }}
            />

            <div className={styles.divider}></div>

            <div className={styles['btn-wrap']}>
                <div
                    className={styles['export-image']}
                    onClick={exportImage}
                    data-tip="导出图片"
                ></div>
            </div>
        </div>
    )
}

export default observer(ToolBar)
