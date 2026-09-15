import { useEffect, useRef } from "react";

function useClickOutside(onOutsideClick, enabled = true, excludeSlateEditors = false) {
   const containerRef = useRef(null);

   useEffect(() => {
      if (!enabled) return;

      function handlePointerDown(event) {
         const container = containerRef.current;

         if (container && container.contains(event.target)) return;
         if (excludeSlateEditors && event.target.closest('[data-slate-editor="true"]')) return;
         if (event.target.closest('[data-id="open-close-dropdown-button"]')) return;
         if (event.target.closest('[data-id="dropdown-checkbox-input"]')) return;

         console.log("useClickOutside triggered");
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