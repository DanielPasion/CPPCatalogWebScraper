import ELK from "elkjs/lib/elk.bundled.js";
import React, { useCallback, useLayoutEffect, useState, useEffect } from "react";
import axios from 'axios'
import "../styles/styles.css"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MarkerType,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  SmoothStepEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import {prereqs} from "../components/prereqjson.jsx"
import {allmajors, preandcoreqs} from "../components/preandcoreqjson.jsx"
import SearchableDropdown from "../components/SearchableDropdown.jsx"

const elk = new ELK();
//const fs = require("fs");

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "250",
  "elk.spacing.nodeNode": "10",
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      // targetPosition: isHorizontal ? "left" : "top",
      // sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

    export const LayoutFlow = (props) => {
    
        const [nodes, setNodes, onNodesChange] = useNodesState([]);
        const [edges, setEdges, onEdgesChange] = useEdgesState([]);
        const { fitView } = useReactFlow();
        
        useEffect(() => {
            try{const jsonData = prereqs(props.major);
            const initialNodes = [];
            const initialEdges = [];
            
            console.log(jsonData)
            jsonData.forEach((course) => {
                const nodeId = course.courseID;
                const nodeData = { label: course.courseID };
                initialNodes.push({
                    id: nodeId,
                    data: nodeData,
                });
    
                course.PreReqs.forEach((prereq) => {
                    const edgeId = `${prereq}-${nodeId}`;
                    initialEdges.push({
                        id: edgeId,
                        source: prereq,
                        target: nodeId,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                        },
                        style: {
                            strokeWidth: "2px",
                        },
                    });
                });
            });
    
            const onLayout = ({ direction }) => {
                const opts = { "elk.direction": direction, ...elkOptions };
    
                getLayoutedElements(initialNodes, initialEdges, opts).then(
                    ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                        setNodes(layoutedNodes);
                        setEdges(layoutedEdges);
                        fitView();
                    }
                );
            };
    
            onLayout({ direction: "DOWN" });
        }
        catch{
            console.log("User is currently typing")
        }
    
        }, [props.major, setNodes, setEdges, fitView]);
    
        const onConnect = useCallback(
            (params) => setEdges((eds) => addEdge(params, eds)),
            []
        );
    
        return (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            />
        );
    };