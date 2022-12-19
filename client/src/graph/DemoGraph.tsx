import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import jquery from 'jquery';
import CytoscapeComponent from 'react-cytoscapejs';
import './jquery.qtip.css'
import ReactDOM from 'react-dom';
import NodeDetails from '../NodeDetails';
import { border } from '@mui/system';

const qtip = require('cytoscape-qtip');

//const jquery = require('jquery')
// BIR ISE YARAMIYOR su an ama filtrelemeyi bu tarz yapabiliriz
function filterNodesByName(cy: cytoscape.Core, name: string) {
  cy.nodes().forEach((node: cytoscape.NodeSingular) => {
    if (node.data('name') !== name) {
      node.style({'display': 'none'});
    }
  });
}

//qtip ( Cytoscape, jquery );
function setSize(node: cytoscape.NodeSingular) {
  if ( node.data('citationCount') == 0) 
  {
    return 30;
  }
  if (node.data('type') == "Author") {
    return 30 + Math.log(node.data('citationCount'));
  } 
  else {
    return 30 + 10*Math.log(node.data('citationCount'));
  }
}

cytoscape.use(qtip)

function DemoGraph(props:any) {


  const styleGraph  = [
    {
      
      selector: 'node[type="Author"]',
      style: {
        'background-color': '#D6EAF8 ',
        
        
        content:'data(abbr)',
        'text-halign':'center',
        'text-valign':'center',
        width:setSize,
        height:setSize,
      }
    },
    {
      selector: 'node[type="Paper"]',
      style: {
        'background-color': '#D1F2EB',
        
        content:'data(abbr)',
        'text-halign':'center',
        'text-valign':'center',
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
    
  ] as Array<cytoscape.Stylesheet>;


  const layout = {name: props.layoutName}
  const element = CytoscapeComponent.normalizeElements(props.elements);

  //const date = {name: props.date}


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
              style={ { width: '1500px', height: '1000px',border: '2px solid',borderColor:'#34495E'
            ,borderRadius:'3%',padding:'5px'}} 
              stylesheet = {styleGraph}  
              minZoom={0.1} 
              maxZoom= {10.0} 
              layout = {layout} />
              
              ;
};

export default DemoGraph;