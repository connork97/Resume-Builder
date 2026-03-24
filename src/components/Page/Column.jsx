import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Section from '../Section/Section.jsx';

import styles from './Page.module.css';

const Column = ({ column }) => {
   const sections = useSelector((state) => state.resume.sections);
   if (!column.sectionIds) {
      console.error(`Column with ID ${column.id} is missing sectionIds.`);
      return (
         <div key={column.id} className={styles.columnWrapperDiv}>
            <p>No sections to display.</p>
         </div>
      );
   }
   // If the column doesn't have a valid width, set it to a default value.
   const columnStyling = {
      width: column?.width ?? `${100 / column?.allIds.length}%`,
   }

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