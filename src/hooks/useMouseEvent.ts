import { useEffect, useState, useRef } from 'react'

export type MouseHookObj<T> = {
    v: T
    setValue: (v: T) => void
}
export function useMouseDown<T>(value: T): MouseHookObj<T> {
    const [dv, setValue] = useState<T>(value)

    const setDValue = (v: T) => {
        setValue(v)
    }

    return { v: dv, setValue: setDValue }
}
export function useMouseUp<T>(value: T): MouseHookObj<T> {
    const [uv, setValue] = useState<T>(value)

    const setUValue = (v: T) => {
        setValue(v)
    }

    return { v: uv, setValue: setUValue }
}
export function useMouseMove<T>(callback?: (v: T) => void) {
    console.log(callback)
    const setMValue = (_v: T) => {
        console.log('22')
        debugger
        callback && callback(_v)
    }

    return setMValue
}
