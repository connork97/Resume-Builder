import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MarginRuler.module.css";
import MarginIndicator from "./MarginIndicator";
import { PaddingPreviewContext, previewLayout } from "../PaddingPreviewContext";
import { parseRemValue } from "@/utils/formatters";

export default function MarginRulerSide({
  renderMarginRuler,
  geometry,
  pageRef,
}) {
  const resume = useSelector((state) => state.resume.present);
  const { preview } = useContext(PaddingPreviewContext);
  const section = resume.sections.byId[resume.activeSectionIds[0]];
  const column = resume.columns.byId[section?.columnId];
  const padding = previewLayout(resume.layout, preview, "resume", null).padding;
  const sectionPadding = previewLayout(
    section?.layout,
    preview,
    "section",
    section?.id,
  )?.padding;
  const topInset = Math.max(
    0,
    parseRemValue(sectionPadding?.top) +
      parseRemValue(resume.layout.gap?.vertical),
  );

  const [marginIndicatorLabelToShow, setMarginIndicatorLabelToShow] =
    useState(null);

  return (
    <div className={styles.marginRulerSideWrapper} data-prevent-blur="true">
      {renderMarginRuler(11, 0.1, ["0"], "bottom")}
      <MarginIndicator
        target="resume"
        side="top"
        value={resume.layout.padding.top}
        pageRef={pageRef}
        className={styles.resumeMarginIndicatorTop}
        style={{ marginTop: padding.top }}
        onMouseEnter={() => setMarginIndicatorLabelToShow("resume-top")}
        onMouseLeave={() => setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)}

      />
      {marginIndicatorLabelToShow === "resume-top" && (
         <span
         className={styles.marginIndicatorLabel}
         style={{
            top: padding.top,
            right: "150%",
            transform: `translateY(-50%)`,
         }}
         >
        {parseFloat(padding.top).toFixed(2) + "rem"}
      </span>
      )}
      {/* <MarginIndicator target="resume" side="bottom" value={resume.layout.padding.bottom} pageRef={pageRef}
      className={styles.resumeMarginIndicatorBottom} style={{ marginBottom: padding.bottom }} />
      <span style={{position: 'absolute', bottom: padding.bottom, right: '150%', transform: `translateY(25%)` }}>{parseFloat(padding.bottom).toFixed(2) + 'rem'}</span> */}

      {section && geometry && section.id !== column?.sectionIds[0] && (
        <>
          <MarginIndicator
            key={`${section.id}-top`}
            target="section"
            id={section.id}
            side="top"
            value={section.layout?.padding?.top}
            pageRef={pageRef}
            className={styles.sectionMarginIndicatorTop}
            style={{ marginTop: `calc(${geometry.top}px + ${topInset}rem)` }}
            onMouseEnter={() =>
              setMarginIndicatorLabelToShow(`${section.id}-top`)
            }
            onMouseLeave={() => setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)}
          />
          {marginIndicatorLabelToShow === `${section.id}-top` && (

             <span
             className={styles.marginIndicatorLabel}
             style={{
                top: `calc(${geometry.top}px + ${topInset}rem)`,
                right: "150%",
                transform: `translateY(-50%)`,
               }}
               >
            {parseFloat(sectionPadding?.top || 0).toFixed(2) + "rem"}
          </span>
         )}
        </>
      )}
      {section && geometry && section.id !== column?.sectionIds.at(-1) && (
        <>
          <MarginIndicator
            key={`${section.id}-bottom`}
            target="section"
            id={section.id}
            side="bottom"
            value={section.layout?.padding?.bottom}
            pageRef={pageRef}
            className={styles.sectionMarginIndicatorBottom}
            style={{ marginTop: geometry.bottom }}
            onMouseEnter={() =>
              setMarginIndicatorLabelToShow(`${section.id}-bottom`)
            }
            onMouseLeave={() => setTimeout(() => setMarginIndicatorLabelToShow(null), 1500)}
          />
          {marginIndicatorLabelToShow === `${section.id}-bottom` && (
            <span
              className={styles.marginIndicatorLabel}
              style={{
                marginTop: geometry.bottom,
                right: "150%",
                transform: `translateY(-50%)`,
              }}
            >
              {parseFloat(sectionPadding?.bottom || 0).toFixed(2) + "rem"}
            </span>
          )}
        </>
      )}
    </div>
  );
}
