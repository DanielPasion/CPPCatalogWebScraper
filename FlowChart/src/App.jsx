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
  const jsonData = jsonMajors['"Aerospace Engineering, B.S.: 127 units"']
  console.log(jsonData)
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
