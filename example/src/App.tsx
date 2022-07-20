import React, { Component, ElementType, ReactNode, useMemo, useRef } from 'react'

import SimpleSheet from '../../src/index';
// import SimpleSheet from '../../dist/index.esm.js';

import './css/styles.css'
const App: React.FC = () => {
    const simpleSheetRef = useRef(null)
    
    return (
        <>
            {/* <button onClick={() => {
                console.log(simpleSheetRef.current?.getCellData())
                // (window as any).aa = simpleSheetRef.current?.getCellData()
            }}>获取</button> */}
            <div className="nav-wrapper">
                <span className="title"><span className='title-logo'></span>Simple Sheet</span>
                <a className='git' target={'_blank'} href="https://github.com/lvming6816077/simple-sheet">GitHub</a>
            </div>
            <div className='sub-title'><span className='logo'></span>Simple Sheet</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <SimpleSheet ref={simpleSheetRef}/>
            </div>
            <div className='desc'>
                <div className='desc-inner'>
                    <h4>特性和功能：</h4>
                    <ul>
                        <li>高性能（使用canvas进行渲染）</li>
                        <li>可定制化</li>
                        <li>支持行、列宽度高度、自动筛选视图、单元格样式和格式设置等</li>
                        <li>计算公式</li>
                    </ul>
                    <div className='btn'>开始</div>
                </div>
            </div>

            <div className='power'>Powered by <a href='https://github.com/lvming6816077' target={'_blank'}>lvming6816077</a></div>
        </>
    )
}

export default App
