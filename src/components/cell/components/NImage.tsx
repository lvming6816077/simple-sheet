import useImage from '@/hooks/useImage'
import { CellStoreContext } from '@/stores/CellStore'
import { ToolBarStoreContext } from '@/stores/ToolBarStore'
import { normalCell } from '@/utils/constants'
import { observer } from 'mobx-react-lite'

import React, {
    CSSProperties,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { Stage, Text, Group, Rect, Image } from 'react-konva'

interface IProps {}

const NImage = React.memo((props: any) => {
    const toolbarStore = useContext(ToolBarStoreContext)
    const cellStore = useContext(CellStoreContext)
    let { imgUrl, width, height, x, y, ownKey, imgLoaded } = props

    const spacing = 3

    const { image, width: imageWidth, height: imageHeight, status } = useImage({
        imgUrl,
    })

    const aspectRatio = useMemo(() => {
        return Math.min(
            (width - spacing) / imageWidth,
            (height - spacing) / imageHeight
        )
    }, [imageWidth, imageHeight, width, height])

    // 动态调整单元格大小
    if (status == 'loaded' && !imgLoaded) {
        let maxw = 150,
            _w = 0,
            _h = 0
        if (imageWidth > maxw) {
            _w = maxw
            _h = (_w * imageHeight) / imageWidth
        } else {
            _w = imageWidth
            _h = (_w * imageHeight) / imageWidth
        }
        cellStore.changeWidth(ownKey, _w)
        cellStore.changeHeight(ownKey, _h)

        cellStore.imgLoadedCell(ownKey)
    }

    if (!imgLoaded) {
        return null
    }

    let _width = Math.min(imageWidth, aspectRatio * imageWidth)
    let _height = Math.min(imageHeight, aspectRatio * imageHeight)

    let _x = x,
        _y = y

    if (width > _width) {
        _x = _x + (width - _width) / 2
        _height = _height - spacing
        // y = y + spacing
    }
    if (height > _height) {
        _y = _y + (height - _height) / 2
        _width = _width - spacing
        _x = _x + spacing / 2
    }

    const dbClick = () => {
        toolbarStore.currentBigImg = [{ src: imgUrl, alt: '' }] as any
    }

    return (
        <>
            <Image
                x={_x}
                y={_y}
                height={_height}
                width={_width}
                image={image}
            />
            <Rect
                onDblClick={dbClick}
                x={x}
                y={y}
                height={height}
                width={width}
                ownKey={props.ownKey}
                type={'normal'}
                noEdit={true}
            ></Rect>
        </>
    )
})
export default NImage
