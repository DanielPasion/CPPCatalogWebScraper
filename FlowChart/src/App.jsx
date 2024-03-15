import ELK from "elkjs/lib/elk.bundled.js";
import React, { useCallback, useLayoutEffect } from "react";
import axios from 'axios'
import "./styles.css"
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

function LayoutFlow() {
  const jsonData = [{"courseID": "BIO 1110", "PreReqs": []}, {"courseID": "BIO 1110L", "PreReqs": []}, {"courseID": "CS 1300", "PreReqs": ["MAT 1140", "MAT 1150"]}, {"courseID": "CS 1400", "PreReqs": ["MAT 1140", "MAT 1150"]}, {"courseID": "CS 2400", "PreReqs": ["CS 1400", "CS 1300", "MAT 1140", "MAT 1150"]}, {"courseID": "CS 2600", "PreReqs": ["CS 1400"]}, {"courseID": "CS 2610", "PreReqs": ["CS 2600"]}, {"courseID": "CS 2640", "PreReqs": ["CS 1300", "CS 1400"]}, {"courseID": "CS 3010", "PreReqs": ["CS 2400", "MAT 1150"]}, {"courseID": "CS 3110", "PreReqs": ["CS 2400"]}, {"courseID": "CS 3310", "PreReqs": ["CS 2400", "STA 2260"]}, {"courseID": "CS 3560", "PreReqs": ["CS 2400"]}, {"courseID": "CS 3650", "PreReqs": ["CS 2640"]}, {"courseID": "CS 3750", "PreReqs": []}, {"courseID": "CS 4080", "PreReqs": ["CS 3110", "CS 2640"]}, {"courseID": "CS 4310", "PreReqs": ["CS 3650", "STA 2260"]}, {"courseID": "CS 4630", "PreReqs": []}, {"courseID": "CS 4800", "PreReqs": ["CS 2400"]}, {"courseID": "MAT 1140", "PreReqs": []}, {"courseID": "MAT 1150", "PreReqs": ["MAT 1140"]}, {"courseID": "PHY 1510", "PreReqs": ["MAT 1140", "MAT 1150"]}, {"courseID": "PHY 1510L", "PreReqs": []}, {"courseID": "STA 2260", "PreReqs": ["MAT 1150"]}, {"courseID": "CS 3520", "PreReqs": ["CS 2400"]}, {"courseID": "CS 3700", "PreReqs": ["CS 3310"]}, {"courseID": "CS 3800", "PreReqs": ["CS 2400", "CS 2640"]}, {"courseID": "CS 4110", "PreReqs": ["CS 3110"]}, {"courseID": "CS 4200", "PreReqs": ["CS 2400", "CS 2410"]}, {"courseID": "CS 4210", "PreReqs": ["CS 2410", "CS 3010"]}, {"courseID": "CS 4230", "PreReqs": ["CS 2400", "CS 2410"]}, {"courseID": "CS 4250", "PreReqs": ["CS 2410", "CS 2400"]}, {"courseID": "CS 4350", "PreReqs": ["CS 2400", "CS 2410"]}, {"courseID": "CS 4450", "PreReqs": ["CS 2400", "CS 2560"]}, {"courseID": "CS 4500", "PreReqs": ["CS 3110"]}, {"courseID": "CS 4600", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4640", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4650", "PreReqs": ["CS 2400", "CS 2410"]}, {"courseID": "CS 4660", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4670", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4700", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4750", "PreReqs": ["CS 2400"]}, {"courseID": "CS 4810", "PreReqs": ["CS 4350", "CS 4800"]}, {"courseID": "CS 4990", "PreReqs": []}, {"courseID": "CS 2250", "PreReqs": ["CS 1400"]}, {"courseID": "CS 2410", "PreReqs": []}, {"courseID": "CS 2450", "PreReqs": ["CS 1400"]}, {"courseID": "CS 2520", "PreReqs": ["CS 1400"]}, {"courseID": "CS 2560", "PreReqs": ["CS 1400"]}, {"courseID": "CS 2990", "PreReqs": []}, {"courseID": "CS 2000", "PreReqs": []}, {"courseID": "CS 4000", "PreReqs": []}, {"courseID": "CS 4410", "PreReqs": []}, {"courseID": "CS 4610", "PreReqs": []}, {"courseID": "CS 4620", "PreReqs": []}, {"courseID": "CS 4820", "PreReqs": ["CS 2400", "CS 2410"]}]
  

  const initialNodes = [];
  const initialEdges = [];
  // console.log(const course[0] in jsonData)
  // for (const a in jsonData ) {
  //   console.log(jsonData[a])
  // }
  // jsonData.forEach((course) => {
  jsonData.forEach((course) => {
    const nodeId = course.courseID;
    const nodeData = { label: course.courseID };

    // Create a node
    initialNodes.push({
      id: nodeId,
      data: nodeData,
    });

    // Create edges for prerequisites
    course.PreReqs.forEach((prereq) => {
      const edgeId = `${prereq}-${nodeId}`;
      initialEdges.push({
        id: edgeId,
        source: prereq,
        target: nodeId,
        // type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          strokeWidth: "2px",
        },
      });
    });
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { "elk.direction": direction, ...elkOptions };

      getLayoutedElements(initialNodes, initialEdges, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: "DOWN", useInitialNodes: true });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    ></ReactFlow>
  );
}

export default () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);
