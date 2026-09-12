import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateFieldLayout, updateSection } from "@/store/resumeSlice.js";



const SectionGrid = ({ section }) => {
  const dispatch = useDispatch();

  useEffect(() => {
  if (section.layout?.display !== "grid") {
    dispatch(
      updateSection({
        id: section.id,
        changes: {
          layout: {
            display: "grid",
            grid: {
              columns: 1,
            },
          },
        },
      }),
    );
  }
  }, [dispatch, section.id, section.layout?.display]);
  const gridColumnsInput = section.layout?.display === "grid"
    ? section.layout?.grid?.columns ?? 1
    : 1;

  const subsectionsById = useSelector((state) => state.resume.subsections.byId);
  const reduxFieldsById = useSelector((state) => state.resume.fields.byId);

  return (
    <>
      {/* <h2>Grid Settings</h2> */}
      <div className="flexColumn">
        <h3>Advanced Orientation:</h3>
        <label htmlFor="flex-direction-select" className="flexRow">
          Columns:
          <input
            className="inputMain"
            type="number"
            value={gridColumnsInput}
            onChange={(e) => {
              dispatch(
                updateSection({
                  id: section.id,
                  changes: {
                    layout: {
                      grid: {
                        columns: e.target.value,
                      },
                    },
                  },
                }),
              );
            }}
            style={{ width: "3rem" }}
          />
        </label>
      </div>

      <div className="flexColumn">
        {/* Advanced Orientation (Check Box to Start a New Row): */}
        {section.subsectionIds.map((subsectionId, index) => {
          const subsection = subsectionsById[subsectionId];
          return (
            <div key={subsectionId}>
              <p style={{ textAlign: "center", fontSize: "125%" }}>
                Subsection {subsectionId}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridColumnsInput}, 1fr)`,
                  backgroundColor: "var(--background-toolbar)",
                  border: "var(--border-main)",
                  borderRadius: "var(--border-radius-main)",
                  gap: "1px",
                  // border: '1px solid white',
                  // gap: "1rem",
                }}
              >
                {subsection.fieldIds.map((fieldId, index) => {
                  const field = reduxFieldsById[fieldId];
                  const fieldIsNewRow = field.layout.startNewRow;
                  const fieldShouldFillRow =
                    field.layout.grid?.fillRow || false;
                  const nextField =
                    reduxFieldsById[subsection.fieldIds[index + 1]];
                  const totalColumns = Math.max(
                    1,
                    Number(gridColumnsInput) || 1,
                  );
                  let currentColumn = 1;

                  for (let i = 0; i < index; i += 1) {
                    const nextRenderedField =
                      reduxFieldsById[subsection.fieldIds[i + 1]];
                    const shouldResetBeforeNext =
                      nextRenderedField?.layout?.startNewRow;

                    if (
                      shouldResetBeforeNext ||
                      currentColumn >= totalColumns
                    ) {
                      currentColumn = 1;
                    } else {
                      currentColumn += 1;
                    }
                  }

                  let isLastColumn = currentColumn === totalColumns;
                  const remainingColumnsInRow =
                    totalColumns - currentColumn + 1;
                  const columnSpanValue = Math.max(1, remainingColumnsInRow);
                  const isOnlyItemInRow =
                    currentColumn === 1 &&
                    (Boolean(nextField?.layout?.startNewRow) || !nextField);
                  const isLastItemInIncompleteRow = !nextField && !isLastColumn;
                  const shouldSpanRemainingColumns =
                    fieldShouldFillRow && isOnlyItemInRow;

                  // console.log(checked);
                  return (
                    <div
                      key={fieldId}
                      style={{
                        gridColumnEnd: shouldSpanRemainingColumns
                          ? `span ${columnSpanValue}`
                          : "auto",
                        gridColumnStart: fieldIsNewRow ? 1 : "auto",
                        width: "100%",
                        backgroundColor: "var(--background-main)",
                        color: "white",
                        border: "var(--border-main)",
                        borderRadius: "var(--border-radius-main)",
                        // textAlign: shouldSpanRemainingColumns && 'right',
                        // border: '1px solid white',
                        // borderRight: 'none',
                        padding: "0.25rem",
                      }}
                    >
                      <p>Field {field.id}</p>
                      <div className="flexColumn">
                        {(currentColumn !== 1 || fieldIsNewRow) && (
                          <div className="flexRow">
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
                            <span>Start New Row</span>
                          </div>
                        )}
                        {(isLastItemInIncompleteRow || isOnlyItemInRow) && (
                          <div className="flexRow">
                            <input
                              type="checkbox"
                              checked={fieldShouldFillRow}
                              onChange={(event) => {
                                // setStartNewRow(event.target.checked)
                                dispatch(
                                  updateFieldLayout({
                                    id: fieldId,
                                    changes: {
                                      grid: {
                                        fillRow: event.target.checked,
                                      },
                                    },
                                  }),
                                );
                              }}
                            />
                            <span>Fill Space</span>
                          </div>
                        )}
                      </div>
                      {/* {fieldLabel} */}
                      {/* {fieldId} */}
                    </div>
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
