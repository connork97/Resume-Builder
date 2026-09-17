import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PreviewPaper from "./PreviewPaper";
import styles from "../ResumePreviewCard.module.css";

export default function PreviewZoom({ resume, anchorRef }) {
  const paperRef = useRef(null);
  const [placement, setPlacement] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const anchor = anchorRef.current.getBoundingClientRect();
      const paper = paperRef.current;
      const gutter = 16;
      const width = Math.max(0, Math.min(320, window.innerWidth - gutter * 2, (window.innerHeight - gutter * 2) * 8.5 / 11));
      const height = width * 11 / 8.5;
      const preferredLeft = anchor.right + gutter;
      const left = preferredLeft + width <= window.innerWidth - gutter
        ? preferredLeft
        : anchor.left - width - gutter;
      setPlacement({
        width,
        height,
        left: Math.max(gutter, Math.min(left, window.innerWidth - width - gutter)),
        top: Math.max(gutter, Math.min(anchor.top + anchor.height / 2 - height / 2, window.innerHeight - height - gutter)),
        scale: Math.min(width / paper.offsetWidth, height / paper.offsetHeight),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(paperRef.current);
    observer.observe(anchorRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [anchorRef]);

  return createPortal(
    <div className={styles.zoom} aria-hidden="true" style={{
      width: placement?.width,
      height: placement?.height,
      left: placement?.left,
      top: placement?.top,
      visibility: placement ? "visible" : "hidden",
    }}>
      <div ref={paperRef} className={styles.resumePaper} style={{
        ...resume.styling,
        transform: `scale(${placement?.scale ?? 0})`,
      }}>
        <PreviewPaper resume={resume} />
      </div>
    </div>,
    document.body,
  );
}
