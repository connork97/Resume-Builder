import { useEffect, useRef } from "react";

function useClickOutside(onOutsideClick, enabled = true, excludeSlateEditors = false) {
   const containerRef = useRef(null);

   useEffect(() => {
      if (!enabled) return;

      function handlePointerDown(event) {
         const container = containerRef.current;

         if (container && container.contains(event.target)) return;
         if (excludeSlateEditors && event.target.closest('[data-slate-editor="true"]')) return;

         onOutsideClick();
      }

      document.addEventListener("pointerdown", handlePointerDown);

      return () => {
         document.removeEventListener("pointerdown", handlePointerDown);
      };
   }, [enabled, onOutsideClick, excludeSlateEditors]);

   return containerRef;
}

export default useClickOutside;