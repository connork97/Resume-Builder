import React, { forwardRef, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import Column from "./components/Column.jsx";
import EndPageMarker from "./components/EndPageMarker.jsx";


import styles from "./ResumePaper.module.css";
import { dndReorderSections } from "@/store/resumeSlice.js";

const ResumePaper = forwardRef(function ResumePaper(props, ref) {

   const dispatch = useDispatch();
  const editorRef = useRef(null);

  const resumeStyling = useSelector((state) => state.resume.styling);
  const columns = useSelector((state) => state.resume.columns);
  const sectionsById = useSelector((state) => state.resume.sections.byId);

  const [items, setItems] = useState({});
  const previousItems = useRef({});
  const [columnOrder, setColumnOrder] = useState([]);

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
      />
    );
  });

  useEffect(() => {
   console.log(items)
  }, [items]);

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
