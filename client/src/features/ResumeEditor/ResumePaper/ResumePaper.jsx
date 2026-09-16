import React, { forwardRef, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import Column from "./Column.jsx";
import EndPageMarker from "./components/EndPageMarker.jsx";


import styles from "./ResumePaper.module.css";
import { dndReorderSections, resizeColumnPair } from "@/store/resumeSlice.js";

const ResumePaper = forwardRef(function ResumePaper(props, ref) {

   const dispatch = useDispatch();
  const localEditorRef = useRef(null);
  const editorRef = props.editorPageRef ?? localEditorRef;

  const resumeStyling = useSelector((state) => state.resume.present.styling);
  const columns = useSelector((state) => state.resume.present.columns);
  const sectionsById = useSelector((state) => state.resume.present.sections.byId);

  const [columnSectionIds, setColumnSectionIds] = useState({});
  const previousColumnSectionIds = useRef({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [previewWidths, setPreviewWidths] = useState(null);
  const resizeState = useRef(null);
  const previewWidthsRef = useRef(null);

  const getColumnWidth = (columnId) =>
    parseFloat(columns.byId[columnId]?.layout?.width?.value) || 0;

  const finishResize = () => {
    const resize = resizeState.current;
    if (!resize) return;

    const widths = previewWidthsRef.current ?? resize.startWidths;
    const leftWidth = widths[resize.leftColumnId];
    const rightWidth = widths[resize.rightColumnId];
    resize.handle.removeEventListener("pointermove", resize.onPointerMove);

    if (leftWidth !== resize.startWidths[resize.leftColumnId]) {
      dispatch(resizeColumnPair({
        leftColumnId: resize.leftColumnId,
        rightColumnId: resize.rightColumnId,
        leftWidth,
        rightWidth,
      }));
    }

    resizeState.current = null;
    previewWidthsRef.current = null;
    setPreviewWidths(null);
  };

  const startResize = (leftColumnId, event) => {
    const leftIndex = columnOrder.indexOf(leftColumnId);
    const rightColumnId = columnOrder[leftIndex + 1];
    const pageWidth = editorRef.current?.getBoundingClientRect().width;
    const leftWidth = getColumnWidth(leftColumnId);
    const rightWidth = getColumnWidth(rightColumnId);
    if (!rightColumnId || !pageWidth || !leftWidth || !rightWidth) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const startWidths = { [leftColumnId]: leftWidth, [rightColumnId]: rightWidth };
    const onPointerMove = (moveEvent) => {
      const resize = resizeState.current;
      if (!resize) return;

      const pairWidth = leftWidth + rightWidth;
      const delta = ((moveEvent.clientX - resize.startX) / pageWidth) * 100;
      const nextLeftWidth = Math.min(Math.max(leftWidth + delta, 10), pairWidth - 10);
      const widths = {
        [leftColumnId]: nextLeftWidth,
        [rightColumnId]: pairWidth - nextLeftWidth,
      };
      previewWidthsRef.current = widths;
      setPreviewWidths(widths);
    };

    resizeState.current = {
      leftColumnId,
      rightColumnId,
      startX: event.clientX,
      startWidths,
      handle: event.currentTarget,
      onPointerMove,
    };
    event.currentTarget.addEventListener("pointermove", onPointerMove);
    event.currentTarget.addEventListener("pointerup", finishResize, { once: true });
    event.currentTarget.addEventListener("pointercancel", finishResize, { once: true });
  };

  const resizeWithKeyboard = (leftColumnId, event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const leftIndex = columnOrder.indexOf(leftColumnId);
    const rightColumnId = columnOrder[leftIndex + 1];
    const leftWidth = getColumnWidth(leftColumnId);
    const rightWidth = getColumnWidth(rightColumnId);
    const adjustment = event.key === "ArrowRight" ? 1 : -1;
    const nextLeftWidth = leftWidth + adjustment;
    if (!rightColumnId || nextLeftWidth < 10 || rightWidth - adjustment < 10) return;

    event.preventDefault();
    dispatch(resizeColumnPair({
      leftColumnId,
      rightColumnId,
      leftWidth: nextLeftWidth,
      rightWidth: rightWidth - adjustment,
    }));
  };

  useEffect(() => {
    const nextItems = {};

    columns.allIds.forEach((columnId) => {
      const column = columns.byId[columnId];
      nextItems[columnId] = Array.isArray(column?.sectionIds)
        ? [...column.sectionIds]
        : [];
    });

    setColumnSectionIds(nextItems);
    setColumnOrder([...columns.allIds]);
  }, [columns]);

  const resumeColumns = columnOrder.map((columnId) => {
    const column = columns.byId[columnId];

    if (!column) {
      console.error(`Column with ID ${columnId} not found.`);
      return null;
    }

    return (
      <Column
        key={column.id}
        column={column}
        sectionIds={columnSectionIds[column.id] ?? []}
        sectionById={sectionsById}
        previewWidth={previewWidths?.[column.id]}
        onStartResize={startResize}
        columnPreviewWidths={previewWidths}
        onResizeWithKeyboard={resizeWithKeyboard}
      />
    );
  });

  return (
    <div className={styles.printPageRef} ref={ref}>
      <div
        className={`${props.isPrinting ? styles.printingPageContainer : styles.editingPageContainer}`}
        style={{ ...resumeStyling }}
        ref={editorRef}
        id="editorPage"
      >
        <DragDropProvider
          onDragStart={() => {
            previousColumnSectionIds.current = columnSectionIds;
          }}
          onDragOver={(event) => {
            const { source } = event.operation;

            if (source?.type === "column") return;

            setColumnSectionIds((currentItems) => move(currentItems, event));
          }}
          onDragEnd={(event) => {
            const { source } = event.operation;

            if (event.canceled) {
              if (source?.type === "section") {
                setColumnSectionIds(previousColumnSectionIds.current);
              }

              return;
            }

            if (source?.type === "column") {
              setColumnOrder((currentColumnOrder) =>
                move(currentColumnOrder, event),
              );
            }
            dispatch(dndReorderSections({ dndKitDict: columnSectionIds }));
          }}
        >
          {resumeColumns}
        </DragDropProvider>
        <EndPageMarker pageRef={editorRef} />
      </div>
    </div>
  );
});

export default ResumePaper;
