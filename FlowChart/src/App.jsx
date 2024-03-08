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
  const jsonData = [{"courseID": "MAT 1140", "PreReqs": []}, {"courseID": "MAT 1150", "PreReqs": ["MAT 1140"]}, {"courseID": "MAT 2010", "PreReqs": ["MAT 1150"]}, {"courseID": "MAT 2010L", "PreReqs": []}, {"courseID": "MAT 2140", "PreReqs": ["MAT 1150"]}, {"courseID": "MAT 2250", "PreReqs": ["MAT 1150"]}, {"courseID": "MAT 3100", "PreReqs": ["MAT 1150"]}, {"courseID": "MAT 3140", "PreReqs": ["MAT 3100", "MAT 2140"]}, {"courseID": "MAT 4170", "PreReqs": ["MAT 2250", "MAT 3100"]}, {"courseID": "MAT 4190", "PreReqs": ["MAT 2250", "MAT 3100"]}, {"courseID": "MAT 4280", "PreReqs": ["MAT 3140", "MAT 2140"]}, {"courseID": "PHY 1510", "PreReqs": ["MAT 1140", "MAT 1150"]}, {"courseID": "PHY 1510L", "PreReqs": []}, {"courseID": "PHY 1520", "PreReqs": ["MAT 1150", "PHY 1510"]}, {"courseID": "PHY 1520L", "PreReqs": []}, {"courseID": "BIO 1210", "PreReqs": []}, {"courseID": "BIO 1210L", "PreReqs": []}, {"courseID": "BIO 1220", "PreReqs": []}, {"courseID": "BIO 1220L", "PreReqs": []}, {"courseID": "STA 2100", "PreReqs": ["MAT 1140", "MAT 1150", "MAT 2140"]}, {"courseID": "STA 2200", "PreReqs": []}, {"courseID": "MAT 3060", "PreReqs": ["MAT 2140"]}, {"courseID": "MAT 3150", "PreReqs": ["MAT 3140"]}, {"courseID": "MAT 3250", "PreReqs": ["MAT 3100"]}, {"courseID": "MAT 3300", "PreReqs": ["MAT 2250", "MAT 3100"]}, {"courseID": "MAT 3310", "PreReqs": ["MAT 3300"]}, {"courseID": "MAT 3470", "PreReqs": ["MAT 2250"]}, {"courseID": "MAT 4180", "PreReqs": ["MAT 4170"]}, {"courseID": "MAT 4200", "PreReqs": ["MAT 2250", "MAT 3100"]}, {"courseID": "MAT 4210", "PreReqs": ["MAT 3140"]}, {"courseID": "MAT 4750", "PreReqs": ["MAT 3100"]}, {"courseID": "MAT 4950", "PreReqs": ["MAT 3250", "MAT 3300", "MAT 3140", "MAT 4170"]}, {"courseID": "MAT 4960", "PreReqs": ["MAT 4950"]}]
  

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
