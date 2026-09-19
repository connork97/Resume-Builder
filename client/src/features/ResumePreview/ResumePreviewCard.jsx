import styles from "./ResumePreviewCard.module.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "@/lib/fetch";
import normalizeResumeFromApi from "@/utils/normalizeResumeFromApi";
import PreviewPaper from "./components/PreviewPaper";
import PreviewZoom from "./components/PreviewZoom";
import { TbExternalLink } from "react-icons/tb";

// styling.width/height size the paper; the caption adds its own height.
// Other styling properties apply to the outer card. Width wins if both are set.
export default function ResumePreviewCard({
  resumeId,
  styling = {},
  caption = true,
  hoverPreview = false,
}) {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const viewportRef = useRef(null);
  const paperRef = useRef(null);
  const [paperScale, setPaperScale] = useState(0);
  const current = result?.id === resumeId ? result : null;
  const resume = current?.resume;
  const loading = Boolean(resumeId) && !current;

  useEffect(() => {
    if (resumeId == null) return;
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
      setPaperScale(
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
  const cardWidth =
    width ?? (cssHeight ? `calc(${cssHeight} * 8.5 / 11)` : undefined);
  return (
    <figure
      className={styles.resumePreviewCard}
      style={{ ...cardStyling, marginBottom: styling.marginBottom, ...(cardWidth != null && { width: cardWidth }) }}
      //   onClick={() => navigate(`/editor/${resumeId}`)}
    >
      <Link
        to={`/editor/${resumeId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          ref={viewportRef}
          className={styles.viewport}
          aria-busy={loading}
          tabIndex={hoverPreview ? 0 : undefined}
          aria-label={
            hoverPreview
              ? `${title}. Focus to enlarge preview; Escape to dismiss.`
              : undefined
          }
          onMouseEnter={() => {
            if (hoverPreview) setZoomOpen(true);
          }}
          onMouseLeave={() => setZoomOpen(false)}
          onFocus={() => {
            if (hoverPreview) setZoomOpen(true);
          }}
          onBlur={() => setZoomOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setZoomOpen(false);
          }}
        >
          <div
            ref={paperRef}
            className={styles.resumePaper}
            role="img"
            aria-label={`${title}, first page preview`}
            aria-hidden={!resume}
            style={{
              ...resume?.styling,
              transform: `scale(${paperScale})`,
              visibility: resume && paperScale ? "visible" : "hidden",
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
        {caption && (
          <figcaption className={styles.resumeTitle} style={{ fontSize: styling.fontSize || '1.5rem'}}>
            {title}
            <TbExternalLink
              style={{ marginLeft: "0.5rem", verticalAlign: "-10%" }}
            />
          </figcaption>
        )}
      </Link>
      {hoverPreview && zoomOpen && resume && (
        <PreviewZoom resume={resume} anchorRef={viewportRef} />
      )}
    </figure>
  );
}
