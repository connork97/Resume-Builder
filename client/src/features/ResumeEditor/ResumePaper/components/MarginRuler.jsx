import React, { useEffect, useRef, useState } from 'react';

import styles from './MarginRuler.module.css';
import MarginRulerTop from './MarginRulerTop';
import MarginRulerSide from './MarginRulerSide';
import { useDispatch, useSelector } from 'react-redux';
import useMarginGeometry from '@/hooks/useMarginGeometry';
import { clearActiveSectionIds, setActiveEditorId, setActiveEditorSelection } from '@/store/resumeSlice';

const MarginRuler = ({ pageRef }) => {

   const dispatch = useDispatch();
   const sectionId = useSelector(state => state.resume.present.activeSectionIds[0] ?? null);
   const columnId = useSelector(state => state.resume.present.sections.byId[sectionId]?.columnId);
   // Share one measurement and observer set between both rulers.
   const geometry = useMarginGeometry(pageRef, columnId, sectionId);

   const [visibleMarginLabels, setVisibleMarginLabels] = useState(() => new Set());
   const marginLabelDisplayTimers = useRef(new Map());

   const cancelHideMarginLabel = (id) => {
      clearTimeout(marginLabelDisplayTimers.current.get(id));
      marginLabelDisplayTimers.current.delete(id);
   };

   const showMarginLabel = (id) => {
      cancelHideMarginLabel(id);
      setVisibleMarginLabels(previous => previous.has(id) ? previous : new Set(previous).add(id));
   };

   const delayHideMarginLabel = (id) => {
      cancelHideMarginLabel(id);
      marginLabelDisplayTimers.current.set(id, setTimeout(() => {
         marginLabelDisplayTimers.current.delete(id);
         setVisibleMarginLabels(previous => {
            const next = new Set(previous);
            next.delete(id);
            return next;
         });
      }, 1500));
   };

   const flashLabel = (id) => {
      showMarginLabel(id);
      delayHideMarginLabel(id);
   };

   useEffect(() => {
      const timers = marginLabelDisplayTimers.current;
      return () => {
         timers.forEach(timer => clearTimeout(timer));
         timers.clear();
      };
   }, []);

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
                     key={value}
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
      const preventBlur = e.target.closest("[data-prevent-blur]");
      if (preventBlur) return;
      dispatch(setActiveEditorId(null));
      dispatch(setActiveEditorSelection(null))
      dispatch(clearActiveSectionIds())
   }

   return (
      <div
         className={styles.marginsContainer}
         onClick={(e) => handleEditorBlur(e)}
      >
         <MarginRulerTop
            visibleMarginLabels={visibleMarginLabels}
            showMarginLabel={showMarginLabel}
            delayHideMarginLabel={delayHideMarginLabel}
            flashLabel={flashLabel}
            geometry={geometry}
            pageRef={pageRef}
            renderMarginRuler={renderMarginRuler}
         />
         <MarginRulerSide
            visibleMarginLabels={visibleMarginLabels}
            showMarginLabel={showMarginLabel}
            delayHideMarginLabel={delayHideMarginLabel}
            flashLabel={flashLabel}
            geometry={geometry}
            pageRef={pageRef}
            renderMarginRuler={renderMarginRuler}
         />
      </div>
   )
}

export default MarginRuler;
