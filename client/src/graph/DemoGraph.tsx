import React, { useRef, useEffect, useState } from "react";
import cytoscape, {
  Core,
  EdgeSingular,
  EventObject,
  NodeSingular,
} from "cytoscape";
//import cxtmenu from "cytoscape-cxtmenu";
import jquery from "jquery";
import CytoscapeComponent from "react-cytoscapejs";
import "./jquery.qtip.css";
import ReactDOM from "react-dom";
import { border } from "@mui/system";
//import cyQtip from 'cytoscape-qtip';
import "cytoscape-context-menus";
import { removeAllListeners } from "process";
//import cxtmenu from 'cytoscape-cxtmenu';
const cola = require("cytoscape-cola");
const dagre = require("cytoscape-dagre");
const euler = require("cytoscape-euler");
const klay = require("cytoscape-klay");
const cose = require("cytoscape-cose-bilkent");
const qtip = require("cytoscape-qtip");
const cxtmenu = require("cytoscape-cxtmenu");

//const jquery = require('jquery')
// BIR ISE YARAMIYOR su an ama filtrelemeyi bu tarz yapabiliriz
function filterNodesByName(cy: cytoscape.Core, name: string) {
  cy.nodes().forEach((node: cytoscape.NodeSingular) => {
    if (node.data("name") !== name) {
      node.style({ display: "none" });
    }
  });
}

//qtip ( Cytoscape, jquery );
function setSize(node: cytoscape.NodeSingular) {
  if (node.data("citationCount") == 0) {
    return 30;
  }
  if (node.data("type") == "Author") {
    return 30 + Math.log(node.data("citationCount"));
  } else {
    return 30 + 10 * Math.log10(node.data("citationCount"));
  }
}

cytoscape.use(qtip);

cytoscape.use(cxtmenu);

cytoscape.use(cola);
cytoscape.use(dagre);

cytoscape.use(euler);
cytoscape.use(klay);
cytoscape.use(cose);

function DemoGraph(props: any) {
  console.log("DEMO GRAPH");
  console.log(props.select);

  const styleGraph = [
    {
      selector: 'node[type="Author"][!selected]',

      style: {
        "background-color": "#dddddd",
        "background-image": `url(https://last-dance-team.github.io/PaperAtlas/person-circle.png)`, // Use the absolute file path of the image
        "background-fit": "cover",
        "background-image-opacity": 1,

        content: "data(abbr)",

        width: setSize,
        height: setSize,
      },
    },
    {
      selector: 'node[type="Author"][?selected]',

      style: {
        "background-color": "#395277",

        content: "data(abbr)",

        width: setSize,
        height: setSize,
      },
    },
    {
      selector: 'node[type="Paper"][!selected]',
      style: {
        "background-image": `url(https://last-dance-team.github.io/PaperAtlas/paper.png)`, // Use the absolute file path of the image
        "background-fit": "cover",
        "background-image-opacity": 1,
        "background-color": "#d185c7",

        content: "data(abbr)",

        width: setSize,
        height: setSize,
      },
    },
    {
      selector: 'node[type="Paper"][?selected]',
      style: {
        "background-color": "#6b4666",

        content: "data(abbr)",

        width: setSize,
        height: setSize,
      },
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        width: 3,
        "line-color": "#777",
        "target-arrow-color": "#777",
        "target-arrow-shape": "triangle",
      },
    },
  ] as Array<cytoscape.Stylesheet>;

  const layout = { name: props.layoutName };
  const element = CytoscapeComponent.normalizeElements(props.elements);

  const cyRef = useRef<Core | null>(null);

  const layoutOptions = {
    name: layout.name,
    animate: true, // enable animations
    animationDuration: 1000, // set the animation duration
  };

  useEffect(() => {
    const cy = cyRef.current;
    const numNodesToAdd = element.length;
    let numNodesAdded = 0;

    function handleClick(event: { target: any }) {
      var node = event.target;
      console.log(node._private.data.label);
      props.handleName(node._private.data.label);
      props.handleDrawerOpenWithState(node._private.data, 1);
      console.log("in demo");
      console.log(props.select);
      if (props.select) {
        console.log("in if");
        props.updateSelect(node._private.data.id, !node._private.data.selected);
      }
      if (cyRef.current) {
        //cyRef.current.off("click", "node");
        //cyRef.current.on("click", "node", handleClick);
      }

      // ...rest of your click handling code
    }

    // get the bounding box of the graph
    if (cy) {
      cy.on("click", "node", handleClick);

      const boundingBox = cy.elements().boundingBox();

      // calculate the center point of the bounding box
      const centerX = boundingBox.x1 + boundingBox.w / 2;
      const centerY = boundingBox.y1 + boundingBox.h / 2;

      // add new nodes to the center of the graph
      cy.add(
        element.map((ele) => {
          numNodesAdded++;
          return {
            data: ele.data,
            position: {
              x: centerX,
              y: centerY,
            },
          };
        })
      );

      const handleNodeAdd = () => {
        if (numNodesAdded === numNodesToAdd) {
          console.log("ever here");
          // animate the nodes to their final positions
          cy.layout(layoutOptions).run();
          // fit the graph to the new nodes
          cy.fit();
        }
      };

      cy.on("add", "node", handleNodeAdd);
      cy.layout(layoutOptions).run();
      // fit the graph to the new nodes
      cy.fit();

      return () => {
        if (cy) {
          cy.off("click", "node");
          cy.off("add", "node");
        }
      };
    }
  }, [element]);

  return (
    <CytoscapeComponent
      cy={(cy): void => {
        cyRef.current = cy;

        //cy.on("click", "node", handleClick);

        // Showing whole title when mouse is on the node
        /*/
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
                */

        // context menu

        let paperToolBox = {
          selector: 'node[type="Paper"]',
          menuRadius: 80, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
          commands: [
            // an array of commands to list in the menu or a function that returns the array

            {
              content: "Pin the node",
              // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                // a function to execute when the command is selected

                if (cyRef.current) {
                  //cyRef.current.off("click", "node");
                  //cyRef.current.on("click", "node", handleClick);
                }
              },
              enabled: true, // whether the command is selectable
            },
            {
              content: "Bring references", // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function (ele: { id: () => any }) {},
              enabled: true,

              // whether the command is selectable
            },
            {
              content: "Bring referenced papers ", // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                console.log("Command 2 selected");
              },
              enabled: true, // whether the command is selectable
            },
            {
              content: "Remove the node", // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                console.log("remove");
              },
              enabled: true, // whether the command is selectable
            },
          ], // function( ele ){ return [ ] }, // a function that returns commands or a promise of commands
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
          outsideMenuCancel: 8, // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
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
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                // a function to execute when the command is selected

                console.log("pin"); // `ele` holds the reference to the active element
              },
              enabled: true, // whether the command is selectable
            },
            {
              content: "Bring all papers", // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                console.log("bring papers");
              },
              enabled: true,

              // whether the command is selectable
            },
            {
              content: "Remove the node", // html/text content to be displayed in the menu
              contentStyle: {
                "font-size": "13px",
                padding: "2px 2px",
              }, // css key:value pairs to set the command's css in js if you want
              select: function () {
                console.log("remove");
              },
              enabled: true, // whether the command is selectable
            },
          ], // function( ele ){ return [  ] }, // a function that returns commands or a promise of commands
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
          outsideMenuCancel: 8, // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
        };

        //cy.cxtmenu(paperToolBox);
        //cy.cxtmenu(authorToolBox);
      }}
      elements={element}
      style={{
        width: "100%",
        height: "75vh",
        border: "2px solid",
        borderColor: "#34495E",
        borderRadius: "3%",
        padding: "5px",
      }}
      stylesheet={styleGraph}
      minZoom={0.1}
      maxZoom={10.0}
    />
  );
}

export default DemoGraph;
