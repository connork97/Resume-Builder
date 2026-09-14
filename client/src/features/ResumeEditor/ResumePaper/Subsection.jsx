import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Field from "./Field";
import { DragDropProvider } from "@dnd-kit/react";
import { dndReorderFields } from "@/store/resumeSlice";
import { useSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator } from "react-icons/md";

const SubsectionRenderer = ({ subsection }) => {
  const dispatch = useDispatch();

  const reduxResume = useSelector((state) => state.resume.present);
  const resumeGap = reduxResume.layout.gap;
  const section = useSelector(
    (state) => state.resume.present.sections.byId[subsection.sectionId],
  );
  const sectionLayout = useSelector(
    (state) => state.resume.present.sections.byId[subsection.sectionId].layout,
  );
  const fields = useSelector((state) => state.resume.present.fields);
  const subsectionLayout = subsection.layout;

  const isLastSubsection = section.subsectionIds.indexOf(subsection.id) === section.subsectionIds.length - 1;

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

  const { ref, handleRef } = useSortable({
    id: subsection.id,
    index: subsection.position,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...parentLayoutDict,
        marginBottom: isLastSubsection ? "0rem" : resumeGap?.subsection || "0rem",
        position: "relative",
        boxSizing: "border-box",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
    >
      {isHovered && section.subsectionIds.length > 1 && (
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
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { source } = event.operation;
          if (!source) return;

          const fromIndex = source.initialIndex;
          const toIndex = source.index;
          const ids = subsection.fieldIds;

          if (
            !Number.isInteger(fromIndex) ||
            !Number.isInteger(toIndex) ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= ids.length ||
            toIndex >= ids.length ||
            fromIndex === toIndex
          ) return;

          dispatch(dndReorderFields({
            subsectionId: subsection.id,
            fromFieldId: ids[fromIndex],
            toFieldId: ids[toIndex],
          }));
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
