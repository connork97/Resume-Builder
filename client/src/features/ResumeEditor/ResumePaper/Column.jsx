import React from "react";
import { useSelector } from "react-redux";
import { useDroppable } from "@dnd-kit/react";

import Section from "./Section.jsx";

import styles from "./ResumePaper.module.css";
import { CollisionPriority } from "@dnd-kit/abstract";

const Column = ({
  column,
  sectionIds,
  sectionById,
  previewWidth,
  columnPreviewWidths,
  onStartResize,
  onResizeWithKeyboard,
}) => {
  const reduxColumns = useSelector(
    (state) => state.resume.present.columns.allIds,
  );
  const isFirstColumn = reduxColumns[0] === column.id;
  const isLastColumn = reduxColumns[reduxColumns.length - 1] === column.id;
  const { ref } = useDroppable({
    id: column.id,
    type: "column",
    accept: "section",
    collisionPriority: CollisionPriority.High,
  });

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
    flex: previewWidth
      ? `0 0 ${previewWidth}%`
      : column?.layout?.width?.auto
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
          hasNextSection={Boolean(sectionById[sectionIds[index + 1]])}
        />
      );
    }
  });

  let previewWidthStrings = [];
  if (columnPreviewWidths) {
    previewWidthStrings.push(
      String(Object.values(columnPreviewWidths)[0]).slice(0, 4) + "%",
    );
    previewWidthStrings.push(
      String(Object.values(columnPreviewWidths)[1]).slice(0, 4) + "%",
    );
  }

  return (
    <div
      key={column.id}
      id={column.id}
      className={styles.columnWrapperDiv}
      style={{ ...columnStyling, position: "relative" }}
      ref={ref}
    >
      {renderedSections}
      {!isLastColumn && (
        <div>
          {columnPreviewWidths?.[column.id] && (
            <p className={styles.columnPreviewWidthLeft}>
              {previewWidthStrings[0]}
            </p>
          )}
          <button
            type="button"
            className={styles.columnResizeHandle}
            aria-label="Resize adjacent columns"
            onPointerDown={(event) => onStartResize(column.id, event)}
            onKeyDown={(event) => onResizeWithKeyboard(column.id, event)}
          />
          {columnPreviewWidths?.[column.id] && (
            <p className={styles.columnPreviewWidthRight}>
              {previewWidthStrings[1]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Column;
