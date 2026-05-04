import React from 'react';

import { useSelector } from 'react-redux';

const renderLeaf = (props) => {
  const { attributes, children, leaf } = props;

  
  const getPxNumber = (value, fallback = 12) => {
    if (value === undefined || value === null) return fallback;
    
    const number = Number(String(value).replace(/[^0-9.]/g, ''));
    
    return Number.isNaN(number) ? fallback : number;
  };

  const resumeStyling = useSelector(state => state.resume.styling);
  const sectionId = useSelector(state => state.resume.activeSectionId);
  const fieldEditorId = useSelector(state => state.resume.activeEditorId);
  const section = useSelector(state => state.resume.sections.byId[sectionId]);

  // console.log('PROPS FROM RENDER LEAF', props)
  const resumeFontSize = getPxNumber(resumeStyling.fontSize);
  const sectionFontSizeOffset = section ? section.styling.fontSizeOffset : 0;
  const leafFontSizeOffset = leaf.fontSizeOffset ?? 0;

  const stylingObj = {
    display: 'inline-block',
    // fontSize: `${resumeFontSize + sectionFontSizeOffset + leafFontSizeOffset}px`,
    fontSize: `${resumeFontSize + leafFontSizeOffset}px`,
    lineHeight: leaf.lineHeight,
    color: leaf.color,
    backgroundColor: leaf.highlightColor,
  }


  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  if (leaf.strikeThrough) {
    styledChildren = <s>{styledChildren}</s>;
  }

  return <span {...attributes} style={stylingObj}>{styledChildren}</span>;
}

export default renderLeaf;