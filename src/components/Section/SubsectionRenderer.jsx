import React from 'react';

import { useSelector } from 'react-redux';

import SlateField from './SlateField';
import FieldRenderer from './FieldRenderer';

const SubsectionRenderer = ({ sub }) => {

   const fields = useSelector((state) => state.resume.fields);
   const { layout } = sub;

   const parentLayoutDict = {
      display: layout.display,
      flexDirection: layout.flexDirection,
      justifyContent: layout.justifyContent,
      justifySelf: layout.justifySelf,
      gridTemplateColumns: layout.gridTemplateColumns,
      gridTemplateRows: layout.gridTemplateRows,
      gap: layout.gap,
   }

   return (
      <div style={parentLayoutDict}>
         {sub.fieldIds.map((fieldId, index) => {
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
         {/* {layout.children.map((child, index) => {

            if (child.type === 'field') {
               const field = fields.find(f => f.id === child.fieldId);
               if (!field) return null;
               return (
                  <FieldRenderer
                     child={child}
                     index={index}
                     field={field}
                     layout={layout}
                     parentLayoutDict={parentLayoutDict}
                  />

               );
            } 
            // Handle other child types (e.g. nested layouts) if needed
            return null;
         })}
            */}
      </div>
   )
}

export default SubsectionRenderer;