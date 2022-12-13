import React, { useEffect, useState } from 'react';
import Cytoscape from "cytoscape";
import CytoscapeComponent from 'react-cytoscapejs';


function DemoGraph(props:any) {

  const elements ={
    'nodes': [
    {
      "data": {
      "type": "Author",
      "label": "Yongtan Liu",
      "authorId": "3404167",
      "id": '42',
      "url": "https://www.semanticscholar.org/author/3404167",
      "citationCount": 285,
      "aliases": [
          "Yong-tan Liu"
        ],
      "paperCount": 44,
      "affiliations": [],
      "homepage": "",
      "hindex": 9
      }
    },
    {
      "data": {
        "type": "Paper",
        "label": "Design unimodular sequence train with low central and recurrent autocorrelation sidelobes via FFT-based cyclic algorithm",
        "id": '172199',
        "paperId": 115182212,
        "url": "https://www.semanticscholar.org/paper/6d9e5a56d76307d29eca125a7a1283bf9e1d1859",
        "citationCount": 5,
        "venue": "",
        "journalName": "",
        "uniqueFieldsOfStudies": [
            "Computer Science",
            "Mathematics"
        ],
        "year": 2017,
        "publicationTypes": [],
        "acl": "",
        "dblp": "",
        "journalPages": "",
        "mag": "2740687494",
        "pubmed": "",
        "referenceCount": 5,
        "arXiv": "",
        "influentialCitaitonCount": {
            "low": 0,
            "high": 0
        },
        "journalVolume": "",
        "isOpenAccess": false,
        "pubMedCentral": "",
        "publicationDate": "",
        "doi": "10.1049/EL.2017.2157"
      }
     }
    ],
    'edges': [
      { data: {  source: 42, target: 172199,  'label' : "an-author-of" } }
    ]}

  const style = [
    {
      selector: 'node[type="Author"]',
      style: {
        'background-color': 'blue',
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node,
        label: 'data(label)',

      }
    },
    {
      selector: 'node[type="Paper"]',
      style: {
        'background-color': 'red',
        label: 'data(label)',
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
      }
    },
    {
      selector: 'edge',
      style: {
        width: 3,
        'line-color': '#122',
        'target-arrow-color': '#321',
        'target-arrow-shape': 'circle',
        label: 'data(label)'
      }
    }
  ]


  const layout = {name: props.layoutName}
  const element = CytoscapeComponent.normalizeElements(elements);


  return <CytoscapeComponent elements={element} style={ { width: '2000px', height: '1000px' }} stylesheet = {style}  minZoom={0.5} maxZoom= {2.0} layout = {layout} />;
};

export default DemoGraph;