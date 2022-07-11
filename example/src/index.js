import React from 'react';
import ReactDOM from "react-dom/client";

import Grid from '../../src/index.ts';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <div style={{display:'flex',justifyContent:'center',alignContent:'center'}}>
        <Grid/>
    </div>
      
  );