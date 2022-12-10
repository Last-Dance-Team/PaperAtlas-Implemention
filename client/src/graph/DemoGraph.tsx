import React, { useEffect, useState } from 'react';
import Cytoscape from "cytoscape";
import CytoscapeComponent from 'react-cytoscapejs';

function DemoGraph() {
      const elements = [
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'ab', source: 'a', target: 'b' } }
      ]

      const style = [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ]





  return <CytoscapeComponent elements={elements}  stylesheet = {style} />;
};

export default DemoGraph;