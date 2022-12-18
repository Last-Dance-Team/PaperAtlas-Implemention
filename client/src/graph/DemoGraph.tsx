import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import jquery from 'jquery';
import CytoscapeComponent from 'react-cytoscapejs';
import './jquery.qtip.css'

const qtip = require('cytoscape-qtip');

//const jquery = require('jquery')

//qtip ( Cytoscape, jquery );
function setSize(node: cytoscape.NodeSingular) {
  if (node.data('type') == "Author") {
    return 30 + Math.log(node.data('citationCount'));
  } 
  else {
    return 30 + 10*Math.log(node.data('citationCount'));
  }
}

cytoscape.use(qtip)

function DemoGraph(props:any) {


  const styleGraph = [
    {
      selector: 'node[type="Author"]',
      style: {
        'background-color': '#a05195',
        label: 'data(abbr)',
        

        'line-height': 15,
        width:setSize,
        height:setSize
        

      }
    },
    {
      selector: 'node[type="Paper"]',
      style: {
        'background-color': '#2f4b7c',
        label: "data(abbr)",
        
        width:setSize,
        height:setSize
      }
    },
    {
      selector: 'edge',
      style: {
        "curve-style": "bezier",
        width: 3,
        'line-color': '#777',
        'target-arrow-color': '#777',
        "target-arrow-shape": "triangle",
      }
    }
  ]


  const layout = {name: props.layoutName}
  const element = CytoscapeComponent.normalizeElements(props.elements);


  return <CytoscapeComponent 
              cy={(cy): void => {
                cy.on("click","node", (event) => {
                  var node = event.target;
                  console.log(node._private.data.label);
                });

                cy.on('mouseover', 'node', function(event) {
                  var node = event.target; // cy.target is the right choice here
                  node.qtip({
                    content: node._private.data.label,
                    show: {
                      event: "mouseover mouseenter "
                    },
                    hide: {
                      event: "mouseleave mouseout"
                    }
                  });
                });

              }}
              elements={element} 
              style={ { width: '1500px', height: '1000px' }} 
              stylesheet = {styleGraph}  
              minZoom={0.5} 
              maxZoom= {2.0} 
              layout = {layout} />;
};

export default DemoGraph;