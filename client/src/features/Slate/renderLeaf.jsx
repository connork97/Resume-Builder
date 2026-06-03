import React from 'react';

const getPxNumber = (value, fallback = 12) => {
  if (value === undefined || value === null) return fallback;

  const number = Number(String(value).replace(/[^0-9.]/g, ''));

  return Number.isNaN(number) ? fallback : number;
};

const Leaf = ({ attributes, children, leaf, resumeStyling, columnStyling = {}, sectionStyling = {}, subsectionStyling = {}, fieldStyling = {} }) => {
  const resumeFontSize = getPxNumber(resumeStyling?.fontSize);
  const columnFontSizeOffset = columnStyling?.fontSizeOffset ?? 0;
  const sectionFontSizeOffset = sectionStyling?.fontSizeOffset ?? 0;
  const subsectionFontSizeOffset = subsectionStyling?.fontSizeOffset ?? 0;
  const fieldFontSizeOffset = fieldStyling?.fontSizeOffset ?? 0;
  const leafFontSizeOffset = leaf.fontSizeOffset ?? 0;

  const fontSize = resumeFontSize + columnFontSizeOffset + sectionFontSizeOffset + subsectionFontSizeOffset + fieldFontSizeOffset + leafFontSizeOffset;

  const stylingObj = {
    display: 'inline-block',
    fontSize: `${fontSize}px`,
    lineHeight: leaf.lineHeight,
    color: leaf.color,
    backgroundColor: leaf.highlightColor,
  };

  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
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
};

export default Leaf;
