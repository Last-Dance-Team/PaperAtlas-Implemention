import React, { useEffect, useState,useCallback } from 'react';
import axios from 'axios';
import cytoscape, { Core, EdgeSingular, EventObject, NodeSingular } from 'cytoscape';
//import cxtmenu from "cytoscape-cxtmenu";
import jquery from 'jquery';
import CytoscapeComponent from 'react-cytoscapejs';
import './jquery.qtip.css'
import ReactDOM from 'react-dom';
import { border } from '@mui/system';
//import cyQtip from 'cytoscape-qtip'; 
import 'cytoscape-context-menus';
//import cxtmenu from 'cytoscape-cxtmenu';



const qtip = require('cytoscape-qtip');
const cxtmenu = require('cytoscape-cxtmenu');




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
    return 30 + 10*Math.log10(node.data('citationCount'));
  }
}

cytoscape.use(qtip)

cytoscape.use(cxtmenu)


const DemoGraph = ((props:any) => {

  //console.log("DEMO GRAPH")

  const[filteredElements, setFilteredElements] = useState<{ nodes: any[], edges: any[]}>({'nodes': [] ,
                                              'edges': []}) 
  const[demoVar,setDemoVar] = useState(1)
  const [isFetching, setIsFetching] = useState(false);

  const demo = useCallback(async() => {
      console.log("demo")
      const response = await axios.get(`/getReferences/116840`);
      const data = await response.data
      setDemoVar((prevDemoVar) => prevDemoVar + 1)
      console.log(demoVar)

    
  }, [isFetching, setDemoVar, demoVar])

  const getReferences = async(paperId: string) => {
    console.log("refrerences")
    const response = await axios.get(`/getReferences/${paperId}`);
    const data = await response.data

    const uniqueNodes = data.nodes.filter((node: any) => 
      !filteredElements.nodes.some((e) => e.data.id === node.data.id)
    )

    const uniqueEdges = data.edges.filter((edge: any) => 
    !filteredElements.edges.some((e) => e.data.source === edge.data.source && e.data.target === edge.data.target)
    )
    //data.nodes.forEach( (element: any) => {
    //  console.log(element)
    //  console.log(filteredElements.nodes.some((e) => e.data.id === element.data.id))
    //});

    //console.log(filteredElements)
    //console.log(data)
    //console.log(uniqueNodes)
    //console.log(uniqueEdges)
    const updatedNodes = uniqueNodes.map((b: any) => {b.data.abbr = (b.data.label).substring(0,10) + '...'
                                return b})
    addUniqueElements(updatedNodes,uniqueEdges)

  }

  const getReferred = async(paperId: string) => {
    console.log("refrerred")
    const response = await axios.get(`/getReferred/${paperId}`);
    const data = await response.data

    const uniqueNodes = data.nodes.filter((node: any) => 
      !filteredElements.nodes.some((e) => e.data.id === node.data.id)
    )

    const uniqueEdges = data.edges.filter((edge: any) => 
    !filteredElements.edges.some((e) => e.data.source === edge.data.source && e.data.target === edge.data.target)
    )

    const updatedNodes = uniqueNodes.map((b: any) => {b.data.abbr = (b.data.label).substring(0,10) + '...'
                                return b})
    addUniqueElements(updatedNodes,uniqueEdges)

  }

  const addUniqueElements = (uniqueNodes: any[], uniqueEdges: any[]) => {

    console.log(demoVar)
    //console.log("setting filtered elements")
    const elements = {
      nodes: [...(filteredElements.nodes), ...uniqueNodes],
      edges: [...(filteredElements.edges), ...uniqueEdges]
    }
    setFilteredElements(elements)
  }


  const styleGraph  = [
    {
      
      selector: 'node[type="Author"]',
      
      style: {
        'background-color': '#ffd000',
        
        
        content:'data(abbr)',

        width:setSize,
        height:setSize,
        
      }
    },
    {
      selector: 'node[type="Paper"]',
      style: {
        'background-color': '#d185c7',
        
        content:'data(abbr)',
        
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
    },
   
    
    
  ] as Array<cytoscape.Stylesheet>;


  const layout = {name: props.layoutName}
  const element = CytoscapeComponent.normalizeElements(props.elements);
  const [selectedId, setSelectedId] = useState("")


  

  
  return (
  <div>
  <CytoscapeComponent 
              cy={(cy): void => {

                let lastClickedNode: any = null;

                function onClickHandler(event: any) {
                  //console.log("here")
                  var node = event.target;
                  if (node !== lastClickedNode) {
                    console.log(node._private.data.label);
                    props.handleName(node._private.data.label);
                    props.handleDrawerOpen(node._private.data);
                    lastClickedNode = node;
                  }
                  //cy.off("click", "node", onClickHandler);
                }

                cy.on("click","node", onClickHandler);

                

                //cy.on("click","node", demoHandler);

                let paperToolBox = {
                  selector: 'node[type="Paper"]',
                  menuRadius: 80, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
                  commands: [
                    // an array of commands to list in the menu or a function that returns the array
      
                    {
                      content: "Pin the node",
                      // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function (ele:any) {
                        props.demo()
                        //demoHandler();
                        //cy.off("cxtmenu", "node", demoHandler);
                        //cy.on("cxtmenu", "node", demoHandler);
                        // a function to execute when the command is selected
                      },
                      enabled: true // whether the command is selectable
                    },
                    {
                      content: "Bring references", // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function (ele:any) {
                        props.getReferences(ele.id())
                      },
                      enabled: true
      
                      // whether the command is selectable
                    },
                    {
                      content: "Bring referenced papers ", // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function(ele:any){
                        props.getReferred(ele.id())
                        
                      },
                      enabled: true // whether the command is selectable
                    },
                    {
                      content: "Remove the node", // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function (ele: any) {
                      },
                      enabled: true // whether the command is selectable
                    }
                  ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
                  fillColor: "black", // the background colour of the menu
                  activeFillColor: "grey", // the colour used to indicate the selected command
                  activePadding: 8, // additional size in pixels for the active command
                  indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                  separatorWidth: 3, // the empty spacing in pixels between successive commands
                  spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                  adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                  //minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                  //maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                  openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                  itemColor: "white", // the colour of text in the command's content
                  itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                  zIndex: 9999, // the z-index of the ui div
                  atMouse: false, // draw menu at mouse position
                  outsideMenuCancel: 8 // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
                };
                
                let authorToolBox = {
                  selector: 'node[type="Author"]',
                  menuRadius: 80, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
                  commands: [
                    // an array of commands to list in the menu or a function that returns the array
      
                    {
                      content: "Pin the node",
                      // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function (ele: any) {
                        // a function to execute when the command is selected
                        
                      },
                      enabled: true // whether the command is selectable
                    },
                    {
                      content: "Bring all papers", // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function (ele:any) {

                      },
                      enabled: true
      
                      // whether the command is selectable
                    },
                    {
                      content: "Remove the node", // html/text content to be displayed in the menu
                      contentStyle: {
                        'font-size': '13px',
                        'padding': '2px 2px'
                      }, // css key:value pairs to set the command's css in js if you want
                      select: function () {

                      },
                      enabled: true // whether the command is selectable
                    }
                  ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
                  fillColor: "black", // the background colour of the menu
                  activeFillColor: "grey", // the colour used to indicate the selected command
                  activePadding: 8, // additional size in pixels for the active command
                  indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                  separatorWidth: 3, // the empty spacing in pixels between successive commands
                  spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                  adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                  //minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                  //maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                  openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                  itemColor: "white", // the colour of text in the command's content
                  itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                  zIndex: 9999, // the z-index of the ui div
                  atMouse: false, // draw menu at mouse position
                  outsideMenuCancel: 8 // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
                };

                

                

                cy.cxtmenu(paperToolBox);
                cy.cxtmenu(authorToolBox);



                
              }}
              
              
              elements={element} 
              style={ { width: '1330px', height: '700px',border: '2px solid',borderColor:'#34495E'
            ,borderRadius:'3%',padding:'5px'}} 
              stylesheet = {styleGraph}  
              minZoom={0.1} 
              maxZoom= {10.0} 
              layout = {layout} />
              <button onClick={props.demo}>Demo</button>
              </div>
  );
});

export default DemoGraph;