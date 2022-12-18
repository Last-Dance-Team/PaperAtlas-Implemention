import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import jquery from 'jquery';
import CytoscapeComponent from 'react-cytoscapejs';
import './jquery.qtip.css'

const qtip = require('cytoscape-qtip');

//const jquery = require('jquery')

//qtip ( Cytoscape, jquery );
cytoscape.use(qtip)

function DemoGraph(props:any) {

  const elements ={
    'nodes': [
    {
      "data": {
        "type": "Paper",
        "label": "Cost Function Design for Stable Performance of Modulated Model Predictive Control for Grid-Tied Inverters",
        "id": "116840",
        "paperId": 220938584,
        "url": "https://www.semanticscholar.org/paper/be16d58dafdace5e590c92f03ea3e757f9fdf86e",
        "citationCount": 0,
        "venue": "2020 IEEE 29th International Symposium on Industrial Electronics (ISIE)",
        "journalName": "",
        "uniqueFieldsOfStudies": [
            "Engineering",
            "Computer Science",
            "Mathematics"
        ],
        "year": 2020,
        "publicationTypes": [],
        "acl": "",
        "dblp": "conf/isie/ZucuniCN0P20",
        "journalPages": "",
        "mag": "3046382787",
        "pubmed": "",
        "referenceCount": 22,
        "arXiv": "",
        "influentialCitaitonCount": {
            "low": 0,
            "high": 0
        },
        "journalVolume": "",
        "isOpenAccess": false,
        "pubMedCentral": "",
        "publicationDate": "",
        "doi": "10.1109/ISIE45063.2020.9152224"
      },
      "position": {
          "x": 0,
          "y": 0
      }
    },
    {
      "data": {
        "type": "Paper",
        "label": "Stability Analysis of Quadratic MPC With a Discrete Input Alphabet",
        "id": "174691",
        "paperId": 2973730,
        "url": "https://www.semanticscholar.org/paper/e774b4cf35dc63ced9f8192259a36952628ef1f1",
        "citationCount": 36,
        "venue": "IEEE Transactions on Automatic Control",
        "journalName": "",
        "uniqueFieldsOfStudies": [
            "Mathematics",
            "Computer Science"
        ],
        "year": 2013,
        "publicationTypes": [],
        "acl": "",
        "dblp": "journals/tac/AguileraQ13",
        "journalPages": "",
        "mag": "1964704454",
        "pubmed": "",
        "referenceCount": 29,
        "arXiv": "",
        "influentialCitaitonCount": {
            "low": 0,
            "high": 0
        },
        "journalVolume": "",
        "isOpenAccess": true,
        "pubMedCentral": "",
        "publicationDate": "",
        "doi": "10.1109/TAC.2013.2264551"
      },
      "position": {
          "x": 0,
          "y": 0
      }
     }
    ],
    'edges': [
      {"data": {
        "source": "174691",
        "target": "116840",
        "label": "a-reference-of"
    }}
    ]}

  const style = [
    {
      selector: 'node[type="Author"]',
      style: {
        'background-color': '#a05195',
        label: 'data(abbr)',

      }
    },
    {
      selector: 'node[type="Paper"]',
      style: {
        'background-color': '#2f4b7c',
        label: 'data(abbr)',
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
              stylesheet = {style}  
              minZoom={0.5} 
              maxZoom= {2.0} 
              layout = {layout} />;
};

export default DemoGraph;