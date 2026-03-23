import React, { useEffect } from 'react';

import SlateField from './SlateField';

const FieldRenderer = ({ index, field, layout, parentLayoutDict }) => {

   const fieldLayoutDict = {
      width: field.width ?? '100%',
      justifySelf: field.justifySelf,
      alignSelf: field.alignSelf,
      textAlign: field.textAlign,
      gridColumn: field.label === 'Description' ? '1 / -1' : field.gridColumn,
   }
   
   const isGrid = layout.display === 'grid';

   useEffect(() => {
      if (field.label === 'Description') {
         fieldLayoutDict.gridColumn = '1 / -1';
      }
   }, [field]);

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
      fieldLayoutDict.justifySelf = field.justifySelf ?? autoAlign;
   }
   return (
      // <div
      //    key={field.id}
      //    style={{
      //       ...field.styling,
      //       ...fieldLayoutDict,
      //    }}>
         <SlateField
            key={field.id}
            field={field}
            styling={{
               ...field.styling,
               ...fieldLayoutDict,
            }}
            sectionId={field.sectionId}
            subsectionId={field.subsectionId}
            layout={parentLayoutDict}
         />
      // </div>
   )
}

export default FieldRenderer;