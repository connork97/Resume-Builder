import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateSection } from "@/store/resumeSlice.js";
import { parseRemValue } from "@/utils/formatters.js";

export default function useSectionPaddingResize(section) {
  const dispatch = useDispatch();
  const dragRef = useRef(null);
  const [previewBottom, setPreviewBottom] = useState(null);

  useEffect(() => () => {
    dragRef.current = null;
  }, []);

  const commit = (bottom) => dispatch(updateSection({
    id: section.id,
    changes: { layout: { padding: { bottom: `${bottom}rem` } } },
  }));

  const valueAtPointer = (event, drag) => Math.max(
    0,
    drag.startBottom + (event.clientY - drag.startY) / drag.pixelsPerRem,
  );

  const finish = (event, canceled = false) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    if (!canceled) {
      const bottom = valueAtPointer(event, drag);
      if (bottom !== drag.startBottom) commit(bottom);
    }
    setPreviewBottom(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    previewBottom,
    handleProps: {
      onClick: (event) => event.stopPropagation(),
      onPointerDown: (event) => {
        event.stopPropagation();
        if (event.button !== 0 || dragRef.current) return;
        event.preventDefault();
        const page = event.currentTarget.closest('#editorPage');
        if (!page) return;
        const scale = page.getBoundingClientRect().height / page.offsetHeight;
        const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        if (!(scale > 0) || !(remSize > 0)) return;
        dragRef.current = {
          pointerId: event.pointerId,
          startY: event.clientY,
          startBottom: parseRemValue(section.layout?.padding?.bottom),
          pixelsPerRem: scale * remSize,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        setPreviewBottom(valueAtPointer(event, drag));
      },
      onPointerUp: (event) => finish(event),
      onPointerCancel: (event) => finish(event, true),
      onLostPointerCapture: (event) => finish(event, true),
      onKeyDown: (event) => {
        event.stopPropagation();
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        if (dragRef.current) return;
        const current = parseRemValue(section.layout?.padding?.bottom);
        const bottom = Math.max(0, Math.round((current + (event.key === "ArrowDown" ? 0.1 : -0.1)) * 1000) / 1000);
        if (bottom !== current) commit(bottom);
      },
    },
  };
}
