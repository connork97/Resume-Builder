import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Field from "./Field";
import { DragDropProvider } from "@dnd-kit/react";
import { dndReorderFields } from "@/store/resumeSlice";

const SubsectionRenderer = ({ subsection }) => {
  const dispatch = useDispatch();
  const sectionLayout = useSelector(
    (state) => state.resume.sections.byId[subsection.sectionId].layout,
  );
  const fields = useSelector((state) => state.resume.fields);
  const subsectionLayout = subsection.layout;

  //   const parentLayoutDict = {
  //    display: 'grid',
  //    gridAutoFlow: subsectionLayout?.flexDirection || sectionLayout?.flexDirection || 'row'
  //    // gridAutoColumns: 'auto',
  //    // gridAutoRows: 'auto'
  //    // gridTemplateColumns: 'auto'
  //   }
  let parentLayoutDict = {};

  if (sectionLayout.display === "flex") {
    parentLayoutDict = {
      display: subsectionLayout?.display || sectionLayout?.display || "flex",
      flexWrap: "wrap",
      flexDirection:
        subsectionLayout?.flexDirection ||
        sectionLayout?.flexDirection ||
        "column",
      justifyContent:
        subsectionLayout?.justifyContent ||
        sectionLayout?.justifyContent ||
        "space-between",
      justifySelf: subsectionLayout?.justifySelf,
      // gridTemplateColumns: subsectionLayout?.gridTemplateColumns,
      // gridTemplateRows: subsectionLayout?.gridTemplateRows,
      gap: subsectionLayout?.gap,
      // width: '1fr'
    };
  } else if (sectionLayout.display === 'grid') {
   parentLayoutDict = {
      display: 'grid',
      gridTemplateColumns: sectionLayout.grid?.columns ? `repeat(${sectionLayout.grid.columns}, auto)` : 'auto'
      
      // gridAutoFlow: 'column',
      // gridAutoColumns: '1fr'
      // gridTemplateColumns: sectionLayout.gridTemplateColumns || 'auto',
   }
  }

  const [fieldReorderDict, setFieldReorderDict] = useState({
    fromFieldId: null,
    toFieldId: null,
    subsectionId: subsection.id,
  });

  return (
    <div style={parentLayoutDict}>
      <DragDropProvider
        onDragStart={({ operation }) => {
          const { source, target } = operation;
          if (!source) {
            console.error("Error occured on field drag start.");
            return;
          }
          //  console.log("DRAG START", "SOURCE: ", source, "TARGET: ", target);
          //  console.log(fieldReorderDict);
          setFieldReorderDict((prevState) => ({
            ...prevState,
            fromFieldId: source.id,
          }));
        }}
        onDragOver={({ operation }) => {
          const { source, target } = operation;
          if (!source || !target) {
            console.error("Error occured on field drag over.");
            return;
          }
          console.log("DRAG OVER", "SOURCE: ", source, "TARGET: ", target);
          if (target?.id !== fieldReorderDict.fromFieldId) {
            setFieldReorderDict((prevState) => ({
              ...prevState,
              toFieldId: target.id,
            }));
          }
        }}
        onDragEnd={({ operation }) => {
          const { source, target } = operation;
          if (!source) {
            console.error("Error occured on field drag end.");
            return;
          }
          //  console.log("DRAG END", "SOURCE: ", source, "TARGET: ", target);
          //  console.log(fieldReorderDict);
          if (
            fieldReorderDict.fromFieldId &&
            fieldReorderDict.toFieldId &&
            fieldReorderDict.subsectionId
          ) {
            dispatch(dndReorderFields(fieldReorderDict));
          }
        }}
      >
        {subsection.fieldIds.map((fieldId, index) => {
          const field = fields.byId[fieldId];
          // const break = field?.value.label === 'Description' ? 'break' : null;
          if (!field) return null;
          return (
            <Field
              key={fieldId}
              index={index}
              fieldId={fieldId}
              // layout={subsectionLayout}
              parentLayoutDict={parentLayoutDict}
            />
          );
        })}
      </DragDropProvider>
    </div>
  );
};

export default SubsectionRenderer;
