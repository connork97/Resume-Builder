import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Field from "./Field";
import { DragDropProvider } from "@dnd-kit/react";
import { dndReorderFields } from "@/store/resumeSlice";
import { useSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator } from "react-icons/md";

const SubsectionRenderer = ({ subsection }) => {
  const dispatch = useDispatch();
  const sectionLayout = useSelector(
    (state) => state.resume.sections.byId[subsection.sectionId].layout,
  );
  const fields = useSelector((state) => state.resume.fields);
  const subsectionLayout = subsection.layout;

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
      gap: subsectionLayout?.gap,
    };
  } else if (sectionLayout.display === "grid") {
    parentLayoutDict = {
      display: "grid",
      gridTemplateColumns: sectionLayout.grid?.columns
        ? `repeat(${sectionLayout.grid.columns}, 1fr)`
        : "auto",
    };
  }

  const [fieldReorderDict, setFieldReorderDict] = useState({
    fromFieldId: null,
    toFieldId: null,
    subsectionId: subsection.id,
  });

  const { ref, handleRef } = useSortable({
    id: subsection.id,
    index: subsection.position,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...parentLayoutDict,
        ...(isHovered ? { border: "1px solid red" } : {}),
        position: "relative",
        boxSizing: "border-box",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
    >
      {isHovered && (
        <MdDragIndicator
          ref={handleRef}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "100%",
            height: "2rem",
            width: "auto",
            cursor: "grab",
            zIndex: 10,
          }}
        />
      )}
      <DragDropProvider
        onDragStart={({ operation }) => {
          const { source, target } = operation;
          if (!source) {
            console.error("Error occured on field drag start.");
            return;
          }
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
         //  if (target?.id !== fieldReorderDict.fromFieldId) {
            setFieldReorderDict((prevState) => ({
              ...prevState,
              toFieldId: target.id,
            }));
         //  }
        }}
        onDragEnd={({ operation }) => {
          const { source, target } = operation;
          if (!source) {
            console.error("Error occured on field drag end.");
            return;
          }
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
