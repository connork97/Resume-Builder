import React from 'react';

import { useSelector } from 'react-redux';

import FieldRenderer from './FieldRenderer';

const SubsectionRenderer = ({ subsection }) => {

   const fields = useSelector((state) => state.resume.fields);
   const { layout } = subsection;

   const parentLayoutDict = {
      display: layout?.display,
      flexDirection: layout?.flexDirection,
      justifyContent: layout?.justifyContent,
      justifySelf: layout?.justifySelf,
      gridTemplateColumns: layout?.gridTemplateColumns,
      gridTemplateRows: layout?.gridTemplateRows,
      gap: layout?.gap,
   }

   return (
      <div style={parentLayoutDict}>
         {subsection.fieldIds.map((fieldId, index) => {
            const field = fields.byId[fieldId];
            if (!field) return null;
            return (
               <FieldRenderer
                  key={fieldId}
                  index={index}
                  field={field}
                  layout={layout}
                  parentLayoutDict={parentLayoutDict}
               />
            );
         })}
      </div>
   )
}

export default SubsectionRenderer;