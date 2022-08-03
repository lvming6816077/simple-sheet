import useImage from '@/hooks/useImage'
import { CellStoreContext } from '@/stores/CellStore'
import { FloatImageStoreContext, TransformObj } from '@/stores/FloatImageStore'
import { ToolBarStoreContext } from '@/stores/ToolBarStore'
import { FloatImage as _FloatImage } from '@/stores/FloatImageStore'
import { normalCell } from '@/utils/constants'
import Konva from 'konva'
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

import { Stage, Text, Group, Rect, Image, Transformer } from 'react-konva'
import _ from 'lodash'

// interface InnerImage extends Pick<_FloatImage, 'x' | 'y'> {width?:number,height?:number}

const FloatImage = React.memo(
    observer((props: _FloatImage) => {
        let { imgUrl, width, height, x, y, id } = props
        const floatImageStore = useContext(FloatImageStoreContext)
        const cellStore = useContext(CellStoreContext)

        const spacing = 0

        const {
            image,
            width: imageWidth,
            height: imageHeight,
            status,
        } = useImage({ imgUrl })

        const trRef = React.useRef<Konva.Transformer>(null)
        const imgRef = React.useRef<Konva.Image>(null)

        const aspectRatio = useMemo(() => {
            return Math.min(
                (width - spacing) / imageWidth,
                (height - spacing) / imageHeight
            )
        }, [imageWidth, imageHeight, width, height])

        let _width = Math.min(imageWidth, aspectRatio * imageWidth)
        let _height = Math.min(imageHeight, aspectRatio * imageHeight)

        let _x = x,
            _y = y

        const isSelected = useMemo(() => {
            return id == floatImageStore.currentTransformerId
        }, [floatImageStore.currentTransformerId])

        useEffect(() => {
            if (isSelected && trRef.current && imgRef.current) {
                trRef.current.nodes([imgRef.current])
                trRef.current.getLayer()!.batchDraw()
            }
        }, [isSelected, status])

        if (status !== 'loaded') {
            return null
        }

        const onSelect = () => {
            floatImageStore.currentTransformerId = id
            hideArea()
        }

        const hideArea = () => {
            cellStore.setActiveCell(null)
            cellStore.setSelectArea(null)
        }

        const onChange = (o: TransformObj) => {
            floatImageStore.floatImage.forEach((i) => {
                if (i.id == id) {
                    i.transformObj = {
                        x: o.x,
                        y: o.y,
                        width: o.width,
                        height: o.height,
                    }
                }
            })
        }

        return (
            <>
                <Image
                    ref={imgRef}
                    x={_x}
                    y={_y}
                    height={_height}
                    width={_width}
                    image={image}
                    draggable
                    onMouseEnter={(e) => {
                        document.body.style.cursor = 'move'
                    }}
                    onMouseLeave={(e) => {
                        document.body.style.cursor = 'default'
                    }}
                    onClick={onSelect}
                    onTap={onSelect}
                    onDragEnd={(e) => {
                        onChange({
                            x: e.target.x(),
                            y: e.target.y(),
                            width: width,
                            height: height,
                        })
                    }}
                    onMouseDown={() => hideArea()}
                    onTransformEnd={(e) => {
                        const node = imgRef.current
                        if (!node) return
                        const scaleX = node.scaleX()
                        const scaleY = node.scaleY()

                        // we will reset it back
                        // node.scaleX(1);
                        // node.scaleY(1);
                        onChange({
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(node.height() * scaleY),
                        })
                    }}
                />
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        anchorStroke="#fff"
                        anchorFill="#4b89ff"
                        anchorSize={8}
                        anchorCornerRadius={8}
                        anchorStrokeWidth={2}
                        borderStroke="#4b89ff"
                        borderDash={[1, 1]}
                        boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox
                            }
                            return newBox
                        }}
                    />
                )}
            </>
        )
    })
)
export default FloatImage
