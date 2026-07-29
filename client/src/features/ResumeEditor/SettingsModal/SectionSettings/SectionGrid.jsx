import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateFieldLayout, updateSection } from "@/store/resumeSlice.js";

import styles from "../SettingsModal.module.css";

const SectionGrid = ({ section }) => {
  const dispatch = useDispatch();

  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  //   const section = useSelector(
  //     (state) => state.resume.sections.byId[activeSectionId],
  //   );

  const [gridColumnsInput, setGridColumnsInput] = useState(
    section.layout.grid?.columns || 1,
  );

  const subsectionsById = useSelector((state) => state.resume.subsections.byId);
  const reduxFieldsById = useSelector((state) => state.resume.fields.byId);

  return (
    <>
      <h2>Grid Settings</h2>
      <label>Base Orientation:</label>
      <div className="flexRow">
        <button
          className="buttonMain"
          onClick={() => {
            let currentSectionColumns = section.layout.grid.columns || 1;
            dispatch(
              updateSection({
                id: section.id,
                changes: {
                  layout: {
                    grid: {
                      columns: currentSectionColumns,
                    },
                  },
                },
              }),
            );
            setGridColumnsInput(currentSectionColumns);
          }}
        >
          Column
        </button>
        <button
          className="buttonMain"
          onClick={() => {
            dispatch(
              updateSection({
                id: section.id,
                changes: {
                  layout: {
                    display: "flex",
                  },
                },
              }),
            );
          }}
        >
          Row
        </button>
      </div>
      <div className="flexColumn">
        Advanced Orientation:
        <label htmlFor="flex-direction-select" className="flexRow">
          Columns:
          <input
            className="inputMain"
            type="number"
            value={gridColumnsInput}
            onChange={(e) => setGridColumnsInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              dispatch(
                updateSection({
                  id: section.id,
                  changes: {
                    layout: {
                      grid: {
                        columns: gridColumnsInput,
                      },
                    },
                  },
                }),
              )
            }
            style={{ width: "3rem" }}
          />
        </label>
      </div>

      <div className="flexColumn">
        Advanced Orientation (Check Box to Start a New Row):
        {section.subsectionIds.map((subsectionId) => {
          const subsection = subsectionsById[subsectionId];
          let columnIndex = 1;
          //  ! WILL NEED TO BE ITS OWN COMPONENT TO AVOID REACT SAFETY ISSUES ! //
          return (
            <div>
              Subsection {subsectionId}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridColumnsInput}, 1fr)`,
                  backgroundColor: "black",
                  border: "1px solid black",
                  gap: "1px",
                  // border: '1px solid white',
                  // gap: "1rem",
                }}
              >
                {subsection.fieldIds.map((fieldId, index) => {
                  const field = reduxFieldsById[fieldId];
                  const fieldIsNewRow = field.layout.startNewRow;
                  const fieldLabel = reduxFieldsById[fieldId].label || "Label";
                  const subsection = useSelector(
                    (state) =>
                      state.resume.subsections.byId[field.subsectionId],
                  );
                  const nextField =
                    reduxFieldsById[subsection.fieldIds[index + 1]];
                  // let checked = false;
                  const [startNewRow, setStartNewRow] = useState(
                    field.layout.startNewRow,
                  );

                  // const [shouldSpanTwo, setShouldSpanTwo] = useState(false);
                  const totalColumns = Math.max(1, Number(gridColumnsInput) || 1);
                  let currentColumn = 1;

                  for (let i = 0; i < index; i += 1) {
                    const nextRenderedField =
                      reduxFieldsById[subsection.fieldIds[i + 1]];
                    const shouldResetBeforeNext =
                      nextRenderedField?.layout?.startNewRow;

                    if (shouldResetBeforeNext || currentColumn >= totalColumns) {
                      currentColumn = 1;
                    } else {
                      currentColumn += 1;
                    }
                  }

                  let isLastColumn = currentColumn === totalColumns;
                  const remainingColumnsInRow = totalColumns - currentColumn + 1;
                  const columnSpanValue = Math.max(1, remainingColumnsInRow);
                  const isOnlyItemInRow =
                    currentColumn === 1 &&
                    (Boolean(nextField?.layout?.startNewRow) || !nextField);
                  const isLastItemInIncompleteRow = !nextField && !isLastColumn;
                  const shouldSpanRemainingColumns =
                    isOnlyItemInRow ||
                    isLastItemInIncompleteRow ||
                    (Boolean(nextField?.layout?.startNewRow) && !isLastColumn);


                  // console.log(checked);
                  return (
                    <span
                      style={{
                        gridColumnEnd: shouldSpanRemainingColumns
                          ? `span ${columnSpanValue}`
                          : "auto",
                        gridColumnStart: fieldIsNewRow ? 1 : "auto",
                        width: "100%",
                        backgroundColor: "white",
                        color: "black",
                        // textAlign: shouldSpanRemainingColumns && 'right',
                        // border: '1px solid white',
                        // borderRight: 'none',
                        padding: "0.25rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={fieldIsNewRow}
                        onChange={(event) => {
                          // setStartNewRow(event.target.checked)
                          dispatch(
                            updateFieldLayout({
                              id: fieldId,
                              changes: {
                                startNewRow: event.target.checked,
                              },
                            }),
                          );
                        }}
                      />
                      Field {index}
                      {/* {fieldLabel} */}
                      {/* {fieldId} */}
                    </span>
                    // <span>{fieldId}</span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SectionGrid;
