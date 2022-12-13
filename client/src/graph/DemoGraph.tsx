import React, { useEffect, useState } from 'react';
import Cytoscape from "cytoscape";
import CytoscapeComponent from 'react-cytoscapejs';


function DemoGraph(props:any) {
      const elements = [
        { data: { id: 'a', type:'author' } },
        { data: { id: 'b' ,type:'paper'} },
        { data: { id: 'c', type: 'author'} },
        { data: { id: 'ab', source: 'a', target: 'b' } },
        { data: { id: 'ac', source: 'a', target: 'c' } },
      ]

      const style = [
        {
          selector: 'node[type="author"]',
          style: {
            'background-color': 'blue',
            label: 'data(type)'
          }
        },
        {
          selector: 'node[type="paper"]',
          style: {
            'background-color': 'red',
            label: 'data(type)'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#122',
            'target-arrow-color': '#321',
            'target-arrow-shape': 'circle'
          }
        }
      ]

    const layout = {name: props.layoutName}
    const element = CytoscapeComponent.normalizeElements(props.elements);

  return <CytoscapeComponent elements={element} style={ { width: '600px', height: '600px' }} stylesheet = {style}  minZoom={0.5} maxZoom= {2.0} layout = {layout} />;
};

export default DemoGraph;