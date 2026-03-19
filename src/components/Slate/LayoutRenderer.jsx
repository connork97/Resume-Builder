import React from 'react';
import SlateField from './SlateField';
import ChildLayoutRenderer from './ChildLayoutRenderer';

const LayoutRenderer = ({ layout, fields }) => {

   const parentLayoutDict = {
      display: layout.display,
      flexDirection: layout.direction,
      justifyContent: layout.justifyContent,
      justifySelf: layout.justifySelf,
      gridTemplateColumns: layout.columns,
      gridTemplateRows: layout.rows,
      gap: layout.gap,
   }

   return (
      <div style={parentLayoutDict}>
         {layout.children.map((child, index) => {

            if (child.type === 'field') {
               const fieldData = fields.find(f => f.id === child.fieldId);
               if (!fieldData) return null;
               return (
                  <ChildLayoutRenderer
                     child={child}
                     index={index}
                     fieldData={fieldData}
                     layout={layout}
                     parentLayoutDict={parentLayoutDict}
                  />

               );
            }
            // Handle other child types (e.g. nested layouts) if needed
            return null;
         })}
      </div>
   )
}

export default LayoutRenderer;