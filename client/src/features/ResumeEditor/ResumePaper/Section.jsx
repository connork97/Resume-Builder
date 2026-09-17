import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { PaddingPreviewContext, previewLayout } from "./PaddingPreviewContext";
import { useDispatch, useSelector } from "react-redux";
import {
  dndReorderSubsections,
  setActiveEditorId,
  setActiveEditorSelection,
  setActiveSectionId,
  setActiveSectionIds,
} from "@/store/resumeSlice.js";
// import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection } from "../../../../../resumeSlice.js";

import SlateHeading from "../../Slate/SlateHeading.jsx";
import styles from "./Section.module.css";
import SettingsModal from "../SettingsModal/SettingsModal.jsx";
import SubsectionRenderer from "./Subsection.jsx";
import { parseRemValue } from "@/utils/formatters.js";
import SectionBorder from "./components/SectionBorder.jsx";
import useSectionPaddingResize from "./useSectionPaddingResize.js";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";

import { MdSettings } from "react-icons/md";

const sectionPointerSensor = PointerSensor.configure({
  preventActivation(event, source) {
    if (
      event.target instanceof Element &&
      event.target.closest('[data-section-dnd-exclude="true"]')
    ) {
      return true;
    }

    return PointerSensor.defaults.preventActivation(event, source);
  },
});

const sectionSensors = [sectionPointerSensor, KeyboardSensor];

const Section = ({ id, section, column, index, hasNextSection }) => {
  const paddingPreview = useContext(PaddingPreviewContext)?.preview;
  const sectionLayout = useMemo(() => previewLayout(section.layout, paddingPreview, 'section', section.id), [section.layout, section.id, paddingPreview]);
  const columnLayout = useMemo(() => previewLayout(column.layout, paddingPreview, 'column', column.id), [column.layout, column.id, paddingPreview]);
  const { previewBottom, handleProps } = useSectionPaddingResize(section);
  useEffect(() => {
    if (!section) {
      console.error("Section component rendered without a valid section prop.");
      return null; // <-- prevents early render
    }
  }, []);

  const dispatch = useDispatch();

  const { ref } = useSortable({
    id: section.id,
    index,
    type: "section",
    accept: "section",
    group: column.id,
    data: { columnId: column.id },
    sensors: sectionSensors,
  });

  const storedResumeLayout = useSelector((state) => state.resume.present.layout);
  const resumeLayout = useMemo(() => previewLayout(storedResumeLayout, paddingPreview, 'resume', null), [storedResumeLayout, paddingPreview]);
  const reduxSections = useSelector((state) => state.resume.present.sections);
  const columns = useSelector((state) => state.resume.present.columns);
  const activeSectionIds = useSelector(
    (state) => state.resume.present.activeSectionIds,
  );
  const subsections = useSelector((state) => state.resume.present.subsections);

  // Derive layout during rendering so clearing a drag preview never exposes
  // padding cached from before the Redux update.
  const isFirstColumn = columns.allIds[0] === column.id;
  const isLastColumn = columns.allIds.at(-1) === column.id;
  const isFirstRow = column.sectionIds[0] === section.id;
  const isLastRow = column.sectionIds.at(-1) === section.id;
  const verticalGap = parseRemValue(resumeLayout?.gap?.vertical);
  const horizontalGap = parseRemValue(resumeLayout?.gap?.horizontal);
  const sectionPadding = {
    paddingLeft: isFirstColumn
      ? resumeLayout.padding.left
      : `${Math.max(0, parseRemValue(columnLayout?.padding?.left) + horizontalGap)}rem`,
    paddingRight: isLastColumn
      ? resumeLayout.padding.right
      : `${Math.max(0, parseRemValue(columnLayout?.padding?.right) + horizontalGap)}rem`,
    paddingTop: isFirstRow
      ? resumeLayout.padding.top
      : `${Math.max(0, parseRemValue(sectionLayout?.padding?.top) + verticalGap)}rem`,
    paddingBottom: isLastRow
      ? 0
      // ? resumeLayout.padding.bottom
      : `${Math.max(0, parseRemValue(sectionLayout?.padding?.bottom) + verticalGap)}rem`,
    flex: isLastRow ? "1" : "none",
  };

  const renderedSubsections = section.subsectionIds?.map((subId) => {
    const subsection = subsections.byId[subId];
    if (!subsection) {
      console.error(`Subsection with ID ${subId} not found.`);
      return null;
    }
    return <SubsectionRenderer key={subsection.id} subsection={subsection} />;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  const handleSetActiveSection = (e) => {
    if (e.ctrlKey) {
      dispatch(setActiveSectionIds(section.id));
    } else {
      dispatch(setActiveSectionId(section.id));
    }
    //  If clicking on the section container itself, not on a subsection or field, clear the active editor and selection to allow changes directly on the section
    if (e.target.dataset.sectionId) {
      dispatch(setActiveEditorId(null));
      dispatch(setActiveEditorSelection([]));
    }
  };

  const sectionIsActive = activeSectionIds.includes(section.id);

  const sectionBorder = section.styling?.border;

  return (
    <div
      className={`${styles.sectionContainerDiv} ${sectionIsActive && styles.activeSectionContainer}`}
      ref={ref}
      data-id={section.id}
      data-column-id={section.columnId}
      data-position={section.position}
      data-section-id={section.id}
      data-section-column-id={section.columnId}
      data-section-position={section.position}
      style={{
        ...section.styling,
        ...sectionPadding,
        ...(previewBottom !== null && {
          paddingBottom: `${Math.max(0, previewBottom + parseRemValue(resumeLayout?.gap?.vertical))}rem`,
        }),
        outlineColor: section.styling?.color,
        cursor: "all-scroll",
      }}
      onClick={(e) => handleSetActiveSection(e)}
    >
      <div
        className={`${styles.sectionContentWrapper} ${sectionIsActive && styles.active}`}
        data-section-id={section.id}
        style={{ cursor: "auto" }}
      >
        <button className={styles.sectionSettingsButton}>
          <span
            className={styles.sectionSettingsButtonIcon}
            onClick={handleSettingsIconClick}
          >
            <MdSettings />
          </span>
        </button>
        {section.showHeading !== false && (
          <SlateHeading key={section.id} section={section} id={section.id} />
        )}
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;

            const { source } = event.operation;
            if (!source) return;

            const fromIndex = source.initialIndex;
            const toIndex = source.index;
            const ids = section.subsectionIds;

            if (
              !Number.isInteger(fromIndex) ||
              !Number.isInteger(toIndex) ||
              fromIndex < 0 ||
              toIndex < 0 ||
              fromIndex >= ids.length ||
              toIndex >= ids.length ||
              fromIndex === toIndex
            ) return;

            dispatch(dndReorderSubsections({
              fromSubsectionId: ids[fromIndex],
              toSubsectionId: ids[toIndex],
            }));
          }}
        >
          {renderedSubsections}
        </DragDropProvider>
      </div>
      {isSettingsModalOpen && (
        <SettingsModal
          section={section}
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          column={column}
        />
      )}
      {sectionBorder?.top && (
        <SectionBorder sectionBorder={sectionBorder.top} borderSide="top" />
      )}
      {sectionBorder?.bottom && (
        <SectionBorder
          sectionBorder={sectionBorder.bottom}
          borderSide="bottom"
        />
      )}
      {sectionBorder?.left && (
        <SectionBorder sectionBorder={sectionBorder.left} borderSide="left" />
      )}
      {sectionBorder?.right && (
        <SectionBorder sectionBorder={sectionBorder.right} borderSide="right" />
      )}
      {hasNextSection && (
        <button
          type="button"
          className={styles.sectionResizeHandle}
          aria-label="Adjust section bottom padding"
          data-section-dnd-exclude="true"
          {...handleProps}
        />
      )}
    </div>
  );
};

export default Section;
