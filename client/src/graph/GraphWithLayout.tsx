import React from "react";
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
    
  
    switch (props.layoutName) {
        case LAYOUT_NAMES.COLA:
            Cytoscape.use(cola);
            break;
        // concentric eklenebilir
        case LAYOUT_NAMES.COSE_BILKENT:
            Cytoscape.use(coseBilkent);
            break;
        case LAYOUT_NAMES.DAGRE:
            Cytoscape.use(dagre);
            break;
        case LAYOUT_NAMES.EULER:
            Cytoscape.use(euler);
            break;
        case LAYOUT_NAMES.KALY:
            Cytoscape.use(klay);
            break;
        default:
            console.log("No resource found");
    }
  
    return <div style={style}>
        <DemoGraph {...props}  />
      </div>;    
    //<DemoGraph {...props} />;
  }
  
  export default GraphWithLayout;