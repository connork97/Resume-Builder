import { useDraggable } from "@dnd-kit/react";
import React from "react";
// import Sortable from "../../features/ResumeEditor/EditorOutline/components/Sortable";

const Draggable = () => {
   const { ref } = useDraggable({
      id: 'draggable'
   })
   const items = [1, 2, 3, 4]
  return (
    <div style={{height: '100vh', width: '100vw', display: 'flex'}}>
         <button id='draggable' style={{margin: 'auto'}} ref={ref}>Draggable</button>
      <ul>
         {/* {items.map((item, index) => ( */}
            {/* <Sortable key={item} id={item} index={index} /> */}
         {/* ))} */}
      </ul>

    </div>
  );
};


export default Draggable;