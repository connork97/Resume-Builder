import React, { useEffect, useState } from "react";

import SlateField from "@/features/Slate/SlateField";
import { useSelector } from "react-redux";

// import { getNodeString } from '@/helpers/getNodeString';

const Field = ({ index, fieldId, layout, parentLayoutDict }) => {
  const field = useSelector((state) => state.resume.fields.byId[fieldId]);
  const activeLayout = layout || parentLayoutDict || {};

  // const plainText = getNodeString(field);

  const fieldLayoutDict = {
    // width: '5rem',
    // width: field?.width || plainText ? 'auto' : '10rem',
    justifySelf: field?.justifySelf,
    alignSelf: field?.alignSelf,
    textAlign: field?.textAlign,
    gridColumn: field?.label === "Description" ? "1 / -1" : field?.gridColumn,
  };

  const isGrid = activeLayout?.display === "grid";

  // useEffect(() => {
  // if (field?.label === 'Description') {
  // fieldLayoutDict.gridColumn = '1 / -1';
  // }
  // }, [field]);

  const getColumnCount = (columns) => {
    if (!columns) return 0;

    // handles: "repeat(2, 1fr)"
    const match = columns.match(/repeat\((\d+),/);
    if (match) return parseInt(match[1]);

    // handles: "1fr 1fr"
    return columns.split(" ").length;
  };

  const columnTemplate =
    activeLayout?.columns || activeLayout?.gridTemplateColumns || "";
  const columnCount = isGrid ? getColumnCount(columnTemplate) : null;

  const getAutoAlignment = (index, columns) => {
    const col = index % columns;

    if (col === 0) return "start"; // First Column Aligns Left
    if (col === columns - 1) return "end"; // Last Column Aligns Right
    return "center"; // Middle Columns Align Center
  };

  if (isGrid && columnCount) {
    const autoAlign = getAutoAlignment(index, columnCount);
    fieldLayoutDict.justifySelf = field.justifySelf ?? autoAlign;
  }

  const [newRowDiv, setNewRowDiv] = useState(null);

  useEffect(() => {
    if (field.layout.startNewRow) {
      setNewRowDiv(<div style={{ flexBasis: "100%", width: 0, height: 0 }} />);
    } else {
      setNewRowDiv(null);
    }
  }, [field.layout]);

  const [isHovered, setIsHovered] = useState(false);

  const reduxFieldsById = useSelector((state) => state.resume.fields.byId);
  const subsection = useSelector(
    (state) => state.resume.subsections.byId[field.subsectionId],
  );
  const nextField = reduxFieldsById[subsection.fieldIds[index + 1]];

  const totalColumns = Math.max(1, Number(columnCount) || 1);
  let currentColumn = 1;

  for (let i = 0; i < index; i += 1) {
    const nextRenderedField = reduxFieldsById[subsection.fieldIds[i + 1]];
    const shouldResetBeforeNext = nextRenderedField?.layout?.startNewRow;

    if (shouldResetBeforeNext || currentColumn >= totalColumns) {
      currentColumn = 1;
    } else {
      currentColumn += 1;
    }
  }

  const isLastColumn = currentColumn === totalColumns;
  const remainingColumnsInRow = totalColumns - currentColumn + 1;
  const columnSpanValue = Math.max(1, remainingColumnsInRow);
  const isOnlyItemInRow =
    currentColumn === 1 &&
    (Boolean(nextField?.layout?.startNewRow) || !nextField);
  const isLastItemInIncompleteRow = !nextField && !isLastColumn;
  const shouldSpanRemainingColumns =
    isGrid &&
    (isOnlyItemInRow ||
      isLastItemInIncompleteRow ||
      (Boolean(nextField?.layout?.startNewRow) && !isLastColumn));

  return (
    <React.Fragment>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          gridColumnEnd: shouldSpanRemainingColumns
            ? `span ${columnSpanValue}`
            : "auto",
         //  gridColumn: (nextField?.layout.startNewRow && !field.layout.startNewRow) ? "auto / -1" : "auto",
          gridColumnStart: field.layout.startNewRow ? 1 : "auto",
          outline: `1px solid ${isHovered ? "black" : "transparent"}`,
         //  textAlign: shouldSpanRemainingColumns && 'right'
        }}
      >
        {/* {newRowDiv} */}
        {/* {field.layout.startNewRow && (
        <div style={{ flexBasis: "100%", width: 0, height: 0 }} />
      )} */}
        <SlateField
          key={field.id}
          field={field}
          index={index}
          styling={{
            ...field.styling,
            ...fieldLayoutDict,
          }}
          sectionId={field.sectionId}
          subsectionId={field.subsectionId}
          layout={parentLayoutDict}
        />
      </div>
    </React.Fragment>
  );
};

export default Field;
