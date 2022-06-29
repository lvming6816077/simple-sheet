import React from 'react';
import ReactDOM from "react-dom/client";

import ReactSimpleImageViewer from '../../src/index.ts';

const root = ReactDOM.createRoot(document.getElementById("root"));
const images = [
    'http://placeimg.com/1200/800/nature',
    'http://placeimg.com/800/1200/nature',
    'http://placeimg.com/1920/1080/nature',
    'http://placeimg.com/1500/500/nature',
  ];

root.render(
      <ReactSimpleImageViewer src={ images } />
  );