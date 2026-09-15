import React, { forwardRef, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import Column from "./Column.jsx";
import EndPageMarker from "./components/EndPageMarker.jsx";


import styles from "./ResumePaper.module.css";
import { dndReorderSections, resizeColumnPair } from "@/store/resumeSlice.js";
import { ActionCreators as UndoActionCreators } from "redux-undo";

const ResumePaper = forwardRef(function ResumePaper(props, ref) {
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (e) => {
      pressedKeys.add(e.code);

      const hasCtrl = e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight");
      const hasAlt = e.altKey || pressedKeys.has("AltLeft") || pressedKeys.has("AltRight");
      const hasUndo = pressedKeys.has("KeyZ")
      //  && (e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight"));
      const hasRedo = pressedKeys.has("KeyY")
      //  && (e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight"));
      const has1 = pressedKeys.has("Digit1") || pressedKeys.has("Numpad1");
      const has2 = pressedKeys.has("Digit2") || pressedKeys.has("Numpad2");
      const has3 = pressedKeys.has("Digit3") || pressedKeys.has("Numpad3");

      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Z");
        dispatch(UndoActionCreators.undo());
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Y");
        dispatch(UndoActionCreators.redo());
      }
      if (hasCtrl && hasAlt && has1 && has2 && has3) {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Alt + 1 + 2 + 3");
      //   dispatch(revertToPreviousState());
      dispatch(UndoActionCreators.undo());
      }
    };

    const handleKeyUp = (e) => {
      pressedKeys.delete(e.code);
    };

    const handleBlur = () => {
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
   const dispatch = useDispatch();
  const localEditorRef = useRef(null);
  const editorRef = props.editorPageRef ?? localEditorRef;

  const resumeStyling = useSelector((state) => state.resume.present.styling);
  const columns = useSelector((state) => state.resume.present.columns);
  const sectionsById = useSelector((state) => state.resume.present.sections.byId);

  const [items, setItems] = useState({});
  const previousItems = useRef({});
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

    setItems(nextItems);
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
        sectionIds={items[column.id] ?? []}
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
            previousItems.current = items;
          }}
          onDragOver={(event) => {
            const { source } = event.operation;

            if (source?.type === "column") return;

            setItems((currentItems) => move(currentItems, event));
          }}
          onDragEnd={(event) => {
            const { source } = event.operation;

            if (event.canceled) {
              if (source?.type === "section") {
                setItems(previousItems.current);
              }

              return;
            }

            if (source?.type === "column") {
              setColumnOrder((currentColumnOrder) =>
                move(currentColumnOrder, event),
              );
            }
            dispatch(dndReorderSections({ dndKitDict: items }));
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
