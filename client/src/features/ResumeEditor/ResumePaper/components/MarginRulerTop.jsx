import { useContext } from "react";
import { useSelector } from "react-redux";
import { PiHouseSimpleFill } from "react-icons/pi";
import styles from "./MarginRuler.module.css";
import MarginIndicator from "./MarginIndicator";
import { PaddingPreviewContext, previewLayout } from "../PaddingPreviewContext";
import { parseRemValue } from "@/utils/formatters";

export default function MarginRulerTop({
  renderMarginRuler,
  geometry,
  pageRef,
  visibleMarginLabels,
  showMarginLabel,
  delayHideMarginLabel,
  flashLabel,
}) {
  const resume = useSelector((state) => state.resume.present);
  const { preview } = useContext(PaddingPreviewContext);
  const section = resume.sections.byId[resume.activeSectionIds[0]];
  const column = resume.columns.byId[section?.columnId];
  const padding = previewLayout(resume.layout, preview, "resume", null).padding;
  const columnPadding = previewLayout(
    column?.layout,
    preview,
    "column",
    column?.id,
  )?.padding;
  const gap = parseRemValue(resume.layout.gap?.horizontal);
  const inset = (side) =>
    Math.max(0, parseRemValue(columnPadding?.[side]) + gap);
  const columnLeft = geometry
    ? `calc(${geometry.left}px + ${inset("left")}rem)`
    : null;
  const contentLeft = column?.id === resume.columns.allIds[0]
    ? padding.left
    : columnLeft;
  const activeTarget = resume.activeEditorId === section?.id
    ? section
    : resume.fields.byId[resume.activeEditorId];
  const indentation = parseRemValue(activeTarget?.layout?.marginLeft);
  const showIndentation = Boolean(
    resume.activeEditorId && section && column && contentLeft != null &&
    Number.isFinite(indentation) && indentation !== 0,
  );

  return (
    <div className={styles.marginRulerTopWrapper} data-prevent-blur="true">
      <MarginIndicator
        target="resume"
        side="left"
        value={resume.layout.padding.left}
        pageRef={pageRef}
        className={styles.resumeMarginIndicatorLeft}
        style={{ marginLeft: padding.left }}
        onLabelShow={() => showMarginLabel("resume-left")}
        onLabelHide={() => delayHideMarginLabel("resume-left")}
        onLabelFlash={() => flashLabel("resume-left")}
      />
      <span
        className={`${styles.marginIndicatorLabel} ${visibleMarginLabels.has("resume-left") ? styles.marginIndicatorLabelVisible : ""}`}
        aria-hidden={!visibleMarginLabels.has("resume-left")}
        style={{
          top: "150%",
          left: padding.left,
          transform: `translateX(-50%)`,
        }}
      >
        {parseFloat(padding.left).toFixed(2) + "rem"}
      </span>
      <MarginIndicator
        target="resume"
        side="right"
        value={resume.layout.padding.right}
        pageRef={pageRef}
        className={styles.resumeMarginIndicatorRight}
        style={{ marginRight: padding.right }}
        onLabelShow={() => showMarginLabel("resume-right")}
        onLabelHide={() => delayHideMarginLabel("resume-right")}
        onLabelFlash={() => flashLabel("resume-right")}
      />
      <span
        className={`${styles.marginIndicatorLabel} ${visibleMarginLabels.has("resume-right") ? styles.marginIndicatorLabelVisible : ""}`}
        aria-hidden={!visibleMarginLabels.has("resume-right")}
        style={{
          top: "150%",
          left: `calc(100% - ${padding.right})`,
          transform: `translateX(-50%)`,
        }}
      >
        {parseFloat(padding.right).toFixed(2) + "rem"}
      </span>
      {column && geometry && column.id !== resume.columns.allIds[0] && (
        <>
          <MarginIndicator
            key={`${column.id}-left`}
            target="column"
            id={column.id}
            side="left"
            value={column.layout?.padding?.left}
            pageRef={pageRef}
            className={styles.sectionMarginIndicatorLeft}
            style={{
              marginLeft: columnLeft,
            }}
            onLabelShow={() => showMarginLabel(`${column.id}-left`)}
            onLabelHide={() => delayHideMarginLabel(`${column.id}-left`)}
            onLabelFlash={() => flashLabel(`${column.id}-left`)}
          />
          <span
            className={`${styles.marginIndicatorLabel} ${visibleMarginLabels.has(`${column.id}-left`) ? styles.marginIndicatorLabelVisible : ""}`}
            aria-hidden={!visibleMarginLabels.has(`${column.id}-left`)}
            style={{
              top: "150%",
              left: columnLeft,
              transform: `translateX(-50%)`,
            }}
          >
            {parseFloat(inset("left")).toFixed(2) + "rem"}
          </span>
        </>
      )}
      {column && geometry && column.id !== resume.columns.allIds.at(-1) && (
        <>
          <MarginIndicator
            key={`${column.id}-right`}
            target="column"
            id={column.id}
            side="right"
            value={column.layout?.padding?.right}
            pageRef={pageRef}
            className={styles.sectionMarginIndicatorRight}
            style={{
              marginLeft: `calc(${geometry.right}px - ${inset("right")}rem)`,
            }}
            onLabelShow={() => showMarginLabel(`${column.id}-right`)}
            onLabelHide={() => delayHideMarginLabel(`${column.id}-right`)}
            onLabelFlash={() => flashLabel(`${column.id}-right`)}
          />
          <span
            className={`${styles.marginIndicatorLabel} ${visibleMarginLabels.has(`${column.id}-right`) ? styles.marginIndicatorLabelVisible : ""}`}
            aria-hidden={!visibleMarginLabels.has(`${column.id}-right`)}
            style={{
              top: "150%",
              left: `calc(${geometry.right}px - ${inset("right")}rem)`,
              transform: `translateX(-50%)`,
            }}
          >
            {parseFloat(inset("right")).toFixed(2) + "rem"}
          </span>
        </>
      )}
      {showIndentation && (
        <PiHouseSimpleFill
          className={styles.indentationIndicator}
          role="img"
          aria-label={`Active ${activeTarget === section ? "heading" : "field"} indentation: ${indentation}rem`}
          title={`Indentation: ${indentation}rem`}
          style={{ left: `calc(${contentLeft} + ${indentation}rem)` }}
        />
      )}
      {renderMarginRuler(8.5, 0.1, ["0"], "top")}
    </div>
  );
}
