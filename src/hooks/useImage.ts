import { useState, useEffect } from 'react'

export interface UseImageProps {
    imgUrl: string
    crossOrigin?: string
    ownKey?: string
}

export interface UseImageResults {
    image?: HTMLImageElement
    width: number
    height: number
    status: string
}

const useImage = ({ imgUrl, crossOrigin, ownKey }: UseImageProps) => {
    const defaultState = {
        image: undefined,
        status: 'loading',
        width: 0,
        height: 0,
    }
    const [state, setState] = useState<UseImageResults>(() => defaultState)

    useEffect(() => {
        if (!imgUrl) return
        var img = new Image()
        setState(defaultState)

        function onload() {
            setState({
                image: img,
                height: img.height,
                width: img.width,
                status: 'loaded',
            })
        }
        function onerror() {
            setState((prev) => ({
                ...prev,
                image: undefined,
                status: 'failed',
            }))
        }
        img.addEventListener('load', onload)
        img.addEventListener('error', onerror)

        crossOrigin && (img.crossOrigin = crossOrigin)
        img.src = imgUrl

        return () => {
            img.removeEventListener('load', onload)
            img.removeEventListener('error', onerror)
        }
    }, [imgUrl, crossOrigin])

    return state
}

export default useImage
