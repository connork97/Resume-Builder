import React from 'react';

import { useSelector } from 'react-redux';

import Field from './Field';

const SubsectionRenderer = ({ subsection }) => {

   const sectionLayout = useSelector(state => state.resume.sections.byId[subsection.sectionId].layout);
   const fields = useSelector((state) => state.resume.fields);
   const subsectionLayout = subsection.layout;

   const parentLayoutDict = {
      display: subsectionLayout?.display || sectionLayout?.display || 'flex',
      flexWrap: 'wrap',
      flexDirection: subsectionLayout?.flexDirection || sectionLayout?.flexDirection || 'column',
      justifyContent: subsectionLayout?.justifyContent || sectionLayout?.justifyContent || 'space-between',
      justifySelf: subsectionLayout?.justifySelf,
      gridTemplateColumns: subsectionLayout?.gridTemplateColumns,
      gridTemplateRows: subsectionLayout?.gridTemplateRows,
      gap: subsectionLayout?.gap,
      // width: '1fr'
   }

   return (
      <div style={parentLayoutDict}>
         {subsection.fieldIds.map((fieldId, index) => {
            const field = fields.byId[fieldId];
            // const break = field?.value.label === 'Description' ? 'break' : null;
            if (!field) return null;
            return (
               <Field
                  key={fieldId}
                  index={index}
                  fieldId={fieldId}
                  // layout={subsectionLayout}
                  parentLayoutDict={parentLayoutDict}
               />
            );
         })}
      </div>
   )
}

export default SubsectionRenderer;
