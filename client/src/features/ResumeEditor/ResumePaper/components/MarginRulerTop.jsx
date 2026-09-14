import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MarginRuler.module.css";
import MarginIndicator from "./MarginIndicator";
import { PaddingPreviewContext, previewLayout } from "../PaddingPreviewContext";
import { parseRemValue } from "@/utils/formatters";

export default function MarginRulerTop({
  renderMarginRuler,
  geometry,
  pageRef,
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

  const [marginIndicatorLabelToShow, setMarginIndicatorLabelToShow] =
    useState(null);
  return (
    <div className={styles.marginRulerTopWrapper} data-prevent-blur="true">
      <MarginIndicator
        target="resume"
        side="left"
        value={resume.layout.padding.left}
        pageRef={pageRef}
        className={styles.resumeMarginIndicatorLeft}
        style={{ marginLeft: padding.left }}
        onMouseEnter={() => setMarginIndicatorLabelToShow("resume-left")}
        onMouseLeave={() =>
          setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)
        }
      />
      {marginIndicatorLabelToShow === "resume-left" && (
        <span
          className={styles.marginIndicatorLabel}
          style={{
            top: "150%",
            left: padding.left,
            transform: `translateX(-50%)`,
          }}
        >
          {parseFloat(padding.left).toFixed(2) + "rem"}
        </span>
      )}
      <MarginIndicator
        target="resume"
        side="right"
        value={resume.layout.padding.right}
        pageRef={pageRef}
        className={styles.resumeMarginIndicatorRight}
        style={{ marginRight: padding.right }}
        onMouseEnter={() => setMarginIndicatorLabelToShow("resume-right")}
        onMouseLeave={() =>
          setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)
        }
      />
      {marginIndicatorLabelToShow === "resume-right" && (
        <span
          className={styles.marginIndicatorLabel}
          style={{
            top: "150%",
            left: `calc(100% - ${padding.right})`,
            transform: `translateX(-50%)`,
          }}
        >
          {parseFloat(padding.right).toFixed(2) + "rem"}
        </span>
      )}
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
              marginLeft: `calc(${geometry.left}px + ${inset("left")}rem)`,
            }}
            onMouseEnter={() => setMarginIndicatorLabelToShow(`${column.id}-left`)}
            onMouseLeave={() =>
              setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)
            }
          />
          {marginIndicatorLabelToShow === `${column.id}-left` && (
            <span
              className={styles.marginIndicatorLabel}
              style={{
                top: "150%",
                left: `calc(${geometry.left}px + ${inset("left")}rem)`,
                transform: `translateX(-50%)`,
              }}
            >
              {parseFloat(inset("left")).toFixed(2) + "rem"}
            </span>
          )}
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
            onMouseEnter={() => setMarginIndicatorLabelToShow(`${column.id}-right`)}
            onMouseLeave={() =>
              setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)
            }
          />
          {marginIndicatorLabelToShow === `${column.id}-right` && (
            <span
              className={styles.marginIndicatorLabel}
              style={{
                top: "150%",
                left: `calc(${geometry.right}px - ${inset("right")}rem)`,
                transform: `translateX(-50%)`,
              }}
            >
              {parseFloat(inset("right")).toFixed(2) + "rem"}
            </span>
          )}
        </>
      )}
      {renderMarginRuler(8.5, 0.1, ["0"], "top")}
    </div>
  );
}
