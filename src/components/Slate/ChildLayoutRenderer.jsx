import React, { useEffect } from 'react';

import SlateField from './SlateField';

const ChildLayoutRenderer = ({ child, index, fieldData, layout, parentLayoutDict }) => {

   const childLayoutDict = {
      width: child.width ?? '100%',
      justifySelf: child.justifySelf,
      alignSelf: child.alignSelf,
      textAlign: child.textAlign,
      gridColumn: fieldData.label === 'Description' ? '1 / -1' : child.gridColumn,
   }
   
   const isGrid = layout.display === 'grid';

   useEffect(() => {
      if (fieldData.label === 'Description') {
         childLayoutDict.gridColumn = '1 / -1';
      }
   }, [fieldData]);

   const getColumnCount = (columns) => {
      if (!columns) return 0;

      // handles: "repeat(2, 1fr)"
      const match = columns.match(/repeat\((\d+),/);
      if (match) return parseInt(match[1]);

      // handles: "1fr 1fr"
      return columns.split(' ').length;
   };

   const columnCount = isGrid ? getColumnCount(layout.columns) : null;

   const getAutoAlignment = (index, columns) => {
      const col = index % columns;

      if (col === 0) return 'start';           // First Column Aligns Left
      if (col === columns - 1) return 'end';   // Last Column Aligns Right
      return 'center';                         // Middle Columns Align Center
   };

   if (isGrid && columnCount) {
      const autoAlign = getAutoAlignment(index, columnCount);
      childLayoutDict.justifySelf = child.justifySelf ?? autoAlign;
   }
   return (
      <div
         key={child.id}
         style={{
            ...fieldData.styling,
            ...childLayoutDict,
         }}>
         <SlateField
            field={fieldData}
            sectionId={fieldData.sectionId}
            subsectionId={fieldData.subsectionId}
            layout={parentLayoutDict}
         />
      </div>
   )
}

export default ChildLayoutRenderer;