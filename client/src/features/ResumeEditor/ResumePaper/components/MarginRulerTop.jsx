import { useContext } from 'react';
import { useSelector } from 'react-redux';
import styles from './MarginRuler.module.css';
import MarginIndicator from './MarginIndicator';
import { PaddingPreviewContext, previewLayout } from '../PaddingPreviewContext';
import { parseRemValue } from '@/utils/formatters';

export default function MarginRulerTop({ renderMarginRuler, geometry, pageRef }) {
  const resume = useSelector(state => state.resume.present);
  const { preview } = useContext(PaddingPreviewContext);
  const section = resume.sections.byId[resume.activeSectionIds[0]];
  const column = resume.columns.byId[section?.columnId];
  const padding = previewLayout(resume.layout, preview, 'resume', null).padding;
  const columnPadding = previewLayout(column?.layout, preview, 'column', column?.id)?.padding;
  const gap = parseRemValue(resume.layout.gap?.horizontal);
  const inset = side => Math.max(0, parseRemValue(columnPadding?.[side]) + gap);
  return <div className={styles.marginRulerTopWrapper} data-prevent-blur="true">
    <MarginIndicator target="resume" side="left" value={resume.layout.padding.left} pageRef={pageRef}
      className={styles.resumeMarginIndicatorLeft} style={{ marginLeft: padding.left }} />
    <MarginIndicator target="resume" side="right" value={resume.layout.padding.right} pageRef={pageRef}
      className={styles.resumeMarginIndicatorRight} style={{ marginRight: padding.right }} />
    {column && geometry && column.id !== resume.columns.allIds[0] &&
      <MarginIndicator key={`${column.id}-left`} target="column" id={column.id} side="left" value={column.layout?.padding?.left} pageRef={pageRef}
        className={styles.sectionMarginIndicatorLeft} style={{ marginLeft: `calc(${geometry.left}px + ${inset('left')}rem)` }} />}
    {column && geometry && column.id !== resume.columns.allIds.at(-1) &&
      <MarginIndicator key={`${column.id}-right`} target="column" id={column.id} side="right" value={column.layout?.padding?.right} pageRef={pageRef}
        className={styles.sectionMarginIndicatorRight} style={{ marginLeft: `calc(${geometry.right}px - ${inset('right')}rem)` }} />}
    {renderMarginRuler(8.5, 0.1, ['0'], 'top')}
  </div>;
}
