import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Section from './Section.jsx';

import styles from '../ResumePaper.module.css';

const Column = ({ column }) => {
   const sections = useSelector((state) => state.resume.sections);
   const columns = useSelector((state) => state.resume.columns);
   if (!column.sectionIds) {
      console.error(`Column with ID ${column.id} is missing sectionIds.`);
      return (
         <div key={column.id} className={styles.columnWrapperDiv}>
            <p>No sections to display.</p>
         </div>
      );
   }

   // If the column doesn't have a valid width, set it to a default value that splits remaining space evenly.
   let columnStyling = {
      flex: column?.layout?.width?.auto
         ? '1 1 0%'
         : `0 0 ${column.layout.width.value}`,
      // paddingLeft: column?.layout?.padding?.left ?? resumeLayout.padding.left,
      // paddingRight: column?.layout?.padding?.right ?? resumeLayout.padding.right,
   };

   const renderedSections = column.sectionIds.map((sectionId) => {
      const section = sections.byId[sectionId];
      if (!sectionId) {
         console.error(`Column with ID ${column.id} has an invalid section ID: ${sectionId}`);
         return null;
      }
      else if (!section) {
         return (
            <div key={sectionId}>
               <p>No Section to Display.</p>
            </div>
         );
      }
      else {
         return <Section key={sectionId} section={section} column={column} />;
      }
   })
   return (
      <div key={column.id} className={styles.columnWrapperDiv} style={columnStyling}>
         {renderedSections}
      </div>
   )
};

export default Column;