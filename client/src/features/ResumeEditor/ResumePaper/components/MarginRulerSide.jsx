import { useContext } from 'react';
import { useSelector } from 'react-redux';
import styles from './MarginRuler.module.css';
import MarginIndicator from './MarginIndicator';
import { PaddingPreviewContext, previewLayout } from '../PaddingPreviewContext';
import { parseRemValue } from '@/utils/formatters';

export default function MarginRulerSide({ renderMarginRuler, geometry, pageRef }) {
  const resume = useSelector(state => state.resume.present);
  const { preview } = useContext(PaddingPreviewContext);
  const section = resume.sections.byId[resume.activeSectionIds[0]];
  const column = resume.columns.byId[section?.columnId];
  const padding = previewLayout(resume.layout, preview, 'resume', null).padding;
  const sectionPadding = previewLayout(section?.layout, preview, 'section', section?.id)?.padding;
  const topInset = Math.max(0, parseRemValue(sectionPadding?.top) + parseRemValue(resume.layout.gap?.vertical));
  return <div className={styles.marginRulerSideWrapper} data-prevent-blur="true">
    {renderMarginRuler(11, 0.1, ['0'], 'bottom')}
    <MarginIndicator target="resume" side="top" value={resume.layout.padding.top} pageRef={pageRef}
      className={styles.resumeMarginIndicatorTop} style={{ marginTop: padding.top }} />
    <MarginIndicator target="resume" side="bottom" value={resume.layout.padding.bottom} pageRef={pageRef}
      className={styles.resumeMarginIndicatorBottom} style={{ marginBottom: padding.bottom }} />
    {section && geometry && section.id !== column?.sectionIds[0] &&
      <MarginIndicator key={`${section.id}-top`} target="section" id={section.id} side="top" value={section.layout?.padding?.top} pageRef={pageRef}
        className={styles.sectionMarginIndicatorTop} style={{ marginTop: `calc(${geometry.top}px + ${topInset}rem)` }} />}
    {section && geometry && section.id !== column?.sectionIds.at(-1) &&
      <MarginIndicator key={`${section.id}-bottom`} target="section" id={section.id} side="bottom" value={section.layout?.padding?.bottom} pageRef={pageRef}
        className={styles.sectionMarginIndicatorBottom} style={{ marginTop: geometry.bottom }} />}
  </div>;
}
