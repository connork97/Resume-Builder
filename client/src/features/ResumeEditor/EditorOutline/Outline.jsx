import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reorderSections } from "@/store/resumeSlice.js";

import FieldRow from "./components/FieldRow.jsx";

import styles from "./Outline.module.css";
import { Node } from "slate";

import { DragDropProvider } from "@dnd-kit/react";
import SortableOutlineSection from "@/features/ResumeEditor/EditorOutline/components/SortableOutlineSection.jsx";

const Outline = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume.present);
  const sections = resume.sections;
  // const sections = useSelector((state) => state.resume.present.sections);

  const [showOutline, setShowOutline] = useState(false);

  // Collapse state for SECTIONS
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? true),
    }));
  };

  // Drag state
  const [dragItem, setDragItem] = useState(null);

  const renderFieldRow = (sectionId, subsectionId, fieldId, fieldIndex) => {
    const isHeaderOrSummary = subsectionId === null;

    return (
      <React.Fragment key={fieldIndex}>
        <FieldRow
          key={fieldId}
          fieldId={fieldId}
          fieldIndex={fieldIndex}
          sectionId={sectionId}
          subsectionId={subsectionId}
          // handleFieldChange={handleFieldChange}
          isHeaderOrSummary={isHeaderOrSummary}
          dragItem={dragItem}
          setDragItem={setDragItem}
        />
        {/* <StartNewRow fieldId={fieldId} /> */}
      </React.Fragment>
    );
  };

  const getSectionById = (sectionId) => {
    return sections.byId[sectionId];
  };

  const getNodeString = (slateValue) => {
    return Node.string(slateValue);
  };

  const [lastDraggedOverSectionId, setLastDraggedOverSectionId] = useState(null);

  return (
    <div
      className={`${styles.outlineWrapper} ${
        showOutline ? styles.visible : styles.hidden
      }`}
    >
      <DragDropProvider
        onDragOver={({ operation }) => {
          const { source, target } = operation;
          console.log(`${source.id} is over ${target?.id}`);
          //  if (!target.id) return;
          if (target?.id && source.id != target?.id) {
            setLastDraggedOverSectionId(target.id);
          }
        }}
        onDragEnd={({ operation }) => {
          const { source, target } = operation;
          console.log(`Dropped ${source.id} onto ${lastDraggedOverSectionId}`);
          if (
            !lastDraggedOverSectionId ||
            source.id === lastDraggedOverSectionId
          ) {
            return;
          }

          dispatch(
            reorderSections({
              fromId: source.id,
              toId: lastDraggedOverSectionId,
            }),
          );
        }}
      >
        <div className={styles.outlineContainer}>
          <div className={styles.outlineTitle}>Resume Outline</div>

          <button
            className={
              showOutline ? styles.hideOutlineButton : styles.showOutlineButton
            }
            onClick={() => setShowOutline(!showOutline)}
          >
            {showOutline ? "⟨⟨⟨" : "⟩⟩⟩"}
          </button>

          {!sections.allIds.length ? (
            <h2>No Sections to Display</h2>
          ) : (
            sections.allIds.map((sectionId, index) => (
              <SortableOutlineSection
                getNodeString={getNodeString}
                getSectionById={getSectionById}
                sectionId={sectionId}
                toggleSection={toggleSection}
                key={sectionId}
                id={sectionId}
                index={index}
                collapsedSections={collapsedSections}
                dragItem={dragItem}
                setDragItem={setDragItem}
                renderFieldRow={renderFieldRow}
              />
            ))
          )}
        </div>
      </DragDropProvider>
    </div>
  );
};

export default Outline;
