import React from 'react';

import styles from './MarginRuler.module.css';
import MarginRulerTop from './MarginRulerTop';
import MarginRulerSide from './MarginRulerSide';
import { useDispatch } from 'react-redux';
import { clearActiveSectionIds, setActiveEditorId, setActiveEditorSelection, setActiveSectionId } from '@/store/resumeSlice';

const MarginRuler = () => {

   const dispatch = useDispatch();

   const renderMarginRuler = (target, step, endsWith = [], position) => {
      const count = target / step + 1;

      return (
         Array.from(
            { length: count }, (_, index) => {
               const value = (index * step).toFixed(1);
               let displayValue = endsWith.includes(value.at(-1))
                  && value != 0 && value != 11;
               return (
                  <span
                     className={
                        displayValue
                           ? position === 'top'
                              ? styles.topMarginRulerSpan : styles.sideMarginRulerSpan
                           : position === 'top'
                              ? styles.topHiddenMarginSpan : styles.sideHiddenMarginSpan
                     }
                     style={{ marginLeft: displayValue && '0.1rem' }}
                     value={value}
                  >
                     {displayValue
                        ? value.endsWith('.0')
                           ? value.slice(0, -2)
                           : value
                        : null}
                  </span>
               )
            }
         )
      );
   }

   const handleEditorBlur = (e) => {
      e.stopPropagation()
      const preventBlur = e.target.closest("[data-prevent-blur");
      if (preventBlur) return;
      dispatch(setActiveEditorId(null));
      dispatch(setActiveEditorSelection(null))
      dispatch(setActiveSectionId(null))
      dispatch(clearActiveSectionIds())
   }

   return (
      <div
         className={styles.marginsContainer}
         onClick={(e) => handleEditorBlur(e)}
      >
         <MarginRulerTop
            renderMarginRuler={renderMarginRuler}
         />
         <MarginRulerSide
            renderMarginRuler={renderMarginRuler}
         />
      </div>
   )
}

export default MarginRuler;





























// import React, { act, useEffect, useState } from 'react';

// import styles from './Margins.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { setResume, updateColumn, updateResume, updateSection } from '@/store/resumeSlice';
// import MarginRulerTop from './MarginRulerTop';

// const MarginRuler = () => {

//    const dispatch = useDispatch()

//    const renderMarginLines = () => {
//       for (let i = 0; i <= 8.5; i += 0.5) {
//          return (
//             <span className={styles.marginSpan}>{i}</span>
//          )
//       }
//    }

//    const resume = useSelector(state => state.resume);
//    const resumePadding = resume?.layout?.padding;

//    const activeSectionId = useSelector(state => state.resume.activeSectionId);
//    // const sections = useSelector(state => state.resume.sections);
//    const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
//    const sectionPadding = section?.layout?.padding;

//    // const isFirstSection = section?.id === sections?.allIds[0];
//    // const isLastSection = section?.id === sections?.allIds[sections.allIds.length - 1];

//    const columns = useSelector(state => state.resume.columns);
//    const column = useSelector(state => state.resume.columns.byId[section?.columnId]);
//    const columnPadding = column?.layout?.padding;

//    const isFirstColumn = column?.id === columns?.allIds[0];
//    const isLastColumn = column?.id === columns?.allIds[columns.allIds.length - 1];


//    const getColumnWidths = (includeCurrent = false) => {
//       let priorColumnWidths = 0;
//       if (!column || !columns?.allIds) return 0;


//       for (const columnId of columns.allIds) {
//          if (String(columnId) === String(column.id) && !includeCurrent) {
//             console.log('prior column widths: ', priorColumnWidths)

//             return priorColumnWidths;
//          }

//          const widthValue = columns.byId[columnId]?.layout?.width?.value || "0%";
//          const parsedColumnWidth = parseFloat(widthValue.replace("%", ""));

//          priorColumnWidths += parsedColumnWidth;
//       }
//       console.log('prior column widths: ', priorColumnWidths)

//       return priorColumnWidths;

//    };

//    const getSectionMargin = (name) => {

//       let parsedColumnPadding = 0;
//       let parsedSectionPadding = 0;

//       if (columnPadding[name]) {
//          parsedColumnPadding = parseFloat(columnPadding[name].replace('rem', '')).toFixed(1);
//       }
//       if (sectionPadding[name]) {
//          parsedSectionPadding = parseFloat(sectionPadding[name].replace('rem', '')).toFixed(1);
//       }

//       const totalPadding = parsedColumnPadding + parsedSectionPadding + 'rem';
//       return totalPadding;
//    }


//    const renderMarginRuler = (target, step, endsWith = [], position) => {
//       const count = target / step + 1;

//       return (
//          Array.from(
//             { length: count }, (_, index) => {
//                const value = (index * step).toFixed(1);
//                const displayValue = endsWith.includes(value.at(-1))
//                   && value !== '0.0';
//                return (
//                   <span
//                      className={
//                         displayValue
//                            ? position === 'top'
//                               ? styles.topMarginRulerSpan : styles.sideMarginRulerSpan
//                            : position === 'top'
//                               ? styles.topHiddenMarginSpan : styles.sideHiddenMarginSpan
//                      }
//                      style={{ marginLeft: displayValue && '0.1rem' }}
//                      value={value}
//                   >
//                      {displayValue
//                         ? value.endsWith('.0')
//                            ? value.slice(0, -2)
//                            : value
//                         : null}
//                   </span>
//                )
//             }
//          )
//       );
//    }


//    const [isEditing, setIsEditing] = useState(false);

//    const handleClick = (e) => {
//       setIsEditing(true);
//       e.currentTarget.focus();
//    };

//    const handleKeyDown = (e) => {
//       if (!isEditing) return;

//       const { name, value } = e.currentTarget.dataset;

//       let parsedOldPaddingVal;
//       let paddingToParse;

//       if (name === 'resume') {
//          paddingToParse = resumePadding;
//       } else if (name === 'column') {
//          paddingToParse = columnPadding;
//       } else if (name === 'section') {
//          paddingToParse = sectionPadding;
//       }

//       parsedOldPaddingVal = parseFloat(paddingToParse[value].replace('rem', '')).toFixed(1);
//       let newPaddingVal = parsedOldPaddingVal;

//       let adjustmentValue = 0.1;

//       // Handles Top Margin Ruler
//       if (e.key === "ArrowLeft" && value === 'left') adjustmentValue = -0.1;
//       if (e.key === "ArrowRight" && value === 'right') adjustmentValue = -0.1;

//       // Handles Side Margin Ruler
//       if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
//       if (e.key === 'ArrowUp' && value === 'top') adjustmentValue = -0.1;
//       if (e.key === 'ArrowDown' && value === 'bottom') adjustmentValue = -0.1;
//       if (e.key === 'ArrowUp' && name === 'section' && value === 'bottom') adjustmentValue = -0.1;

//       newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;
//       newPaddingVal = parseFloat(newPaddingVal).toFixed(1) + 'rem';

//       if (name === 'resume') {
//          dispatch(updateResume({
//             key: 'layout',
//             changes: {
//                padding: {
//                   ...resumePadding,
//                   [value]: newPaddingVal
//                }
//             }
//          }))
//       } else if (name === 'column') {
//          dispatch(updateColumn({
//             id: column.id,
//             changes: {
//                layout: {
//                   padding: {
//                      [value]: newPaddingVal
//                   }
//                }
//             }
//          }))
//       } else if (name === 'section') {
//          dispatch(updateSection({
//             id: section.id,
//             changes: {
//                layout: {
//                   padding: {
//                      [value]: newPaddingVal
//                   }
//                }
//             }
//          }))
//       }
//       if (e.key === "Enter") {
//          setIsEditing(false);
//          e.currentTarget.blur();
//       }
//    };

//    return (
//       <div className={styles.marginsContainer}>
//          <MarginRulerTop />
//       </div>
//    )
// }

// export default MarginRuler;
