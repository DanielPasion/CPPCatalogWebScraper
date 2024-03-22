import ELK from "elkjs/lib/elk.bundled.js";
import React, { useCallback, useLayoutEffect, useState, useEffect } from "react";
import axios from 'axios'
import "./styles/styles.css"
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
import {prereqs} from "./components/prereqjson.jsx"
import {allmajors, preandcoreqs} from "./components/preandcoreqjson.jsx"
import SearchableDropdown from "./components/SearchableDropdown.jsx"
import { LayoutFlow } from "./components/LayoutFlow.jsx";


// export default () => (
//   <ReactFlowProvider>
//     <LayoutFlow major = "Computer Science, B.S.: 120 units"/>
//   </ReactFlowProvider>
// );

function App() {
  //Used to set the values of the dropdown menu
  let [major, setMajor] = useState("Computer Science, B.S.: 120 units");
  
  //Used to get all majors and store into options section of SearchableDropdown
  const list_of_majors = allmajors();

  //Function used to update the major when clicked on the search bar
  function changeMajor(major) {
    setMajor(major)
  }

  return (
    <>
      <SearchableDropdown
            options={list_of_majors}
            label="major"
            id="id"
            selectedVal={major}
            handleChange={(val) => changeMajor(val)}
      />
      <ReactFlowProvider>
        <LayoutFlow major = {major}/>
      </ReactFlowProvider>
    </>
  )
}

export default App