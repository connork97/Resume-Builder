import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// Measure indicator offsets in pixels relative to the page.
export default function useMarginGeometry(pageRef, columnId, sectionId) {
   // Recalculate when Redux column data changes.
   const columns = useSelector(state => state.resume.present.columns);
   const [geometry, setGeometry] = useState(null);
   // Observe layout after React updates the DOM.
   useLayoutEffect(() => {
      const page = pageRef.current;
      if (!page) return;
      let frame;
      const measure = () => {
         // Find the selected column and outer section element.
         const column = Array.from(page.children).find(
            element => element.id === String(columnId),
         );
         const section = column && Array.from(column.children).find(
            element => element.dataset.sectionId === String(sectionId),
         );
         let next = null;
         if (column && section) {
            // Convert viewport coordinates to page offsets.
            const pageRect = page.getBoundingClientRect();
            const columnRect = column.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const scaleX = pageRect.width / page.offsetWidth || 1;
            const scaleY = pageRect.height / page.offsetHeight || 1;
            next = {
               columnId,
               sectionId,
               left: (columnRect.left - pageRect.left) / scaleX,
               right: (columnRect.right - pageRect.left) / scaleX,
               top: (sectionRect.top - pageRect.top) / scaleY,
               bottom: (sectionRect.bottom - pageRect.top) / scaleY,
            };
         }
         // Skip state updates when positions are unchanged.
         setGeometry(previous => (
            JSON.stringify(previous) === JSON.stringify(next) ? previous : next
         ));
      };
      // Batch measurements into the next animation frame.
      const scheduleMeasure = () => {
         cancelAnimationFrame(frame);
         frame = requestAnimationFrame(measure);
      };
      // Track size changes across the page, columns, and sections.
      const resizeObserver = new ResizeObserver(scheduleMeasure);
      const observeLayout = () => {
         resizeObserver.disconnect();
         resizeObserver.observe(page);
         for (const column of page.children) {
            resizeObserver.observe(column);
            for (const section of column.children) resizeObserver.observe(section);
         }
      };
      // Refresh observers when DOM content or styles change.
      const mutationObserver = new MutationObserver(() => {
         observeLayout();
         scheduleMeasure();
      });
      mutationObserver.observe(page, {
         childList: true,
         subtree: true,
         attributes: true,
         characterData: true,
      });
      // Start observation and take the initial measurement.
      observeLayout();
      scheduleMeasure();

      // Release observers and pending work on cleanup.
      return () => {
         cancelAnimationFrame(frame);
         resizeObserver.disconnect();
         mutationObserver.disconnect();
      };
   }, [pageRef, columns, columnId, sectionId]);
   // Hide old measurements while a new selection is being measured.
   return geometry?.columnId === columnId && geometry?.sectionId === sectionId
      ? geometry
      : null;
}
