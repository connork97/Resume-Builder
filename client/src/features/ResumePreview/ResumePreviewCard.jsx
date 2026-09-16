import styles from "./ResumePreviewCard.module.css";
import { useEffect, useRef, useState } from "react";
import { fetchApi } from "@/lib/fetch";
import normalizeResumeFromApi from "@/utils/normalizeResumeFromApi";
import PreviewPaper from "./components/PreviewPaper";

// styling.width/height size the paper; the caption adds its own height.
// Other styling properties apply to the outer card. Width wins if both are set.
export default function ResumePreviewCard({ resumeId, styling = {}, caption = true }) {
  const [result, setResult] = useState(null);
  const viewportRef = useRef(null);
  const paperRef = useRef(null);
  const [scale, setScale] = useState(0);
  const current = result?.id === resumeId ? result : null;
  const resume = current?.resume;
  const loading = Boolean(resumeId) && !current;

  useEffect(() => {
    if (!resumeId) return;
    const controller = new AbortController();
    // Same normalization as getResumeFromApi, but failures stay in the tile
    // rather than opening that service's blocking alert.
    async function fetchResume() {
      try {
        const data = await fetchApi({
          endpoint: `/resumes/${encodeURIComponent(resumeId)}`,
          options: { signal: controller.signal },
        });
        const normalized = normalizeResumeFromApi(data);
        if (!controller.signal.aborted)
          setResult({ id: resumeId, resume: normalized });
      } catch {
        if (!controller.signal.aborted)
          setResult({ id: resumeId, resume: null });
      }
    }
    fetchResume();
    return () => controller.abort();
  }, [resumeId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const paper = paperRef.current;
    // Observe the unscaled editor dimensions so rem spacing and line wrapping
    // stay identical as the thumbnail shrinks to fit its container.
    const observer = new ResizeObserver(() => {
      setScale(
        Math.min(
          viewport.clientWidth / paper.offsetWidth,
          viewport.clientHeight / paper.offsetHeight,
        ),
      );
    });
    observer.observe(viewport);
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);

  const title = resume?.title || "Resume template";
  const { width, height, ...cardStyling } = styling;
  const cssHeight = typeof height === "number" ? `${height}px` : height;
  const cardWidth = width ?? (cssHeight ? `calc(${cssHeight} * 8.5 / 11)` : undefined);
  return (
    <figure className={styles.card} style={{ ...cardStyling, ...(cardWidth != null && { width: cardWidth }) }}>
      {caption && <figcaption className={styles.caption}>{title}</figcaption>}
      <div ref={viewportRef} className={styles.viewport} aria-busy={loading}>
        <div
          ref={paperRef}
          className={styles.paper}
          role="img"
          aria-label={`${title}, first page preview`}
          aria-hidden={!resume}
          style={{
            ...resume?.styling,
            transform: `scale(${scale})`,
            visibility: resume && scale ? "visible" : "hidden",
          }}
        >
          {resume && <PreviewPaper resume={resume} />}
        </div>
        {!resume && (
          <p role="status" className={styles.status}>
            {loading ? "Loading preview…" : "Preview unavailable"}
          </p>
        )}
      </div>
    </figure>
  );
}
