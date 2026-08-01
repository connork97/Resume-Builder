import { useEffect, useRef } from "react";

function useClickOutside(onOutsideClick, enabled = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event) {
      const container = containerRef.current;

      if (container && !container.contains(event.target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [enabled, onOutsideClick]);

  return containerRef;
}

export default useClickOutside;