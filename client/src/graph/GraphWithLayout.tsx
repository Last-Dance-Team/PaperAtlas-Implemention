import React, { useState, useEffect } from 'react';
import Cytoscape from "cytoscape";

import dagre from 'cytoscape-dagre'
import euler from 'cytoscape-euler'
import klay from 'cytoscape-klay'


import { LAYOUT_NAMES } from "../constants/Layout";
import DemoGraph from "./DemoGraph";

const cola = require('cytoscape-cola');
const coseBilkent = require('cytoscape-cose-bilkent');

const style = {margin: '15px'}

function GraphWithLayout(props: any) {

    
    const [elements, setElements] = useState(props.elements);

    useEffect(() => {
        setElements(elements); // update elements whenever nodes or edges change
      }, elements);

      //console.log("layout in GraphWithLayout", props.layoutName)
    return <div style={style}>
        <DemoGraph elements= {props.elements} {...props}  layoutName= {props.layoutName}  />
      </div>;    
    //<DemoGraph {...props} />;
  }
  
  export default GraphWithLayout;