import React, {
    CSSProperties,
    MouseEventHandler,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

import styles from './styles.module.css'

const ColorPanel = (props: any) => {
    const colorClick = (e: React.MouseEvent<HTMLElement> | any) => {
        var color = e.target.style.backgroundColor
        if (color) {
            props.getColor(color)
        }
    }

    return (
        <div>
            <table className={styles['color-table']} onClick={colorClick}>
                <tbody className="">
                    <tr>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(255, 255, 255)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(0, 1, 0)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(231, 229, 230)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(68, 85, 105)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(91, 156, 214)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(237, 125, 49)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(165, 165, 165)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(255, 192, 1)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(67, 113, 198)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(113, 174, 71)' }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(242, 242, 242)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(127, 127, 127)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(208, 206, 207)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(213, 220, 228)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(222, 234, 246)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(252, 229, 213)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(237, 237, 237)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(255, 242, 205)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(217, 226, 243)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(227, 239, 217)',
                                }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(216, 216, 216)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(89, 89, 89)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(175, 171, 172)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(173, 184, 202)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(189, 215, 238)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(247, 204, 172)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(219, 219, 219)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(255, 229, 154)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(179, 198, 231)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(197, 224, 179)',
                                }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(191, 191, 191)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(63, 63, 63)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(117, 111, 111)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(133, 150, 176)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(156, 194, 230)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(244, 177, 132)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(201, 201, 201)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(254, 217, 100)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(142, 170, 218)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(167, 208, 140)',
                                }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(165, 165, 165)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(38, 38, 38)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(58, 56, 57)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(51, 63, 79)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(46, 117, 181)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(196, 90, 16)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(123, 123, 123)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(191, 142, 1)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(47, 85, 150)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(83, 129, 54)' }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{
                                    backgroundColor: 'rgb(127, 127, 127)',
                                }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(12, 12, 12)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(23, 21, 22)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(34, 42, 53)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(31, 78, 122)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(132, 60, 10)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(82, 82, 82)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(126, 96, 0)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(32, 56, 100)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(54, 86, 36)' }}
                            ></div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(192, 0, 0)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(254, 0, 0)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(253, 193, 1)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(255, 255, 1)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(147, 208, 81)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(0, 176, 78)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(1, 176, 241)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(1, 112, 193)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(1, 32, 96)' }}
                            ></div>
                        </td>
                        <td className="">
                            <div
                                className={styles['color-table-item']}
                                style={{ backgroundColor: 'rgb(112, 48, 160)' }}
                            ></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ColorPanel
