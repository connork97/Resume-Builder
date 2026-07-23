import React from "react";

import { useDroppable } from "@dnd-kit/react";

import Section from "./Section.jsx";

import styles from "../ResumePaper.module.css";
import { CollisionPriority } from "@dnd-kit/abstract";

const Column = ({ column, sectionIds, sectionById }) => {
  if (!sectionIds) {
    console.error(`Column with ID ${column.id} is missing sectionIds.`);
    return (
      <div key={column.id} className={styles.columnWrapperDiv}>
        <p>No sections to display.</p>
      </div>
    );
  }

  // If the column doesn't have a valid width, set it to a default value that splits remaining space evenly.
  let columnStyling = {
    flex: column?.layout?.width?.auto
      ? "1 1 0%"
      : `0 0 ${column?.layout?.width?.value}`,
    // paddingLeft: column?.layout?.padding?.left ?? resumeLayout.padding.left,
    // paddingRight: column?.layout?.padding?.right ?? resumeLayout.padding.right,
  };

  const renderedSections = sectionIds.map((sectionId, index) => {
    const section = sectionById[sectionId];
    if (!sectionId) {
      console.error(
        `Column with ID ${column.id} has an invalid section ID: ${sectionId}`,
      );
      return null;
    } else if (!section) {
      return (
        <div key={sectionId}>
          <p>No Section to Display.</p>
        </div>
      );
    } else {
      return (
        <Section
          key={sectionId}
          id={sectionId}
          section={section}
          column={column}
          index={index}
        />
      );
    }
  });

  const { ref } = useDroppable({
    id: column.id,
    type: 'column',
    accept: 'section',
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <div
      key={column.id}
      id={column.id}
      className={styles.columnWrapperDiv}
      style={columnStyling}
      ref={ref}
    >
      {renderedSections}
    </div>
  );
};

export default Column;
