import React from 'react';

export const getPxNumber = (value, fallback = 12) => {
  if (value === undefined || value === null) return fallback;

  const number = Number(String(value).replace(/[^0-9.]/g, ''));

  return Number.isNaN(number) ? fallback : number;
};

export const getNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;

  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};

export const roundToTenth = (value) => Number(getNumber(value, 0).toFixed(1));

export const getCascadedFontSize = ({
  resumeStyling,
  columnStyling = {},
  sectionStyling = {},
  subsectionStyling = {},
  fieldStyling = {},
  leafStyling = {},
}) => {
  const resumeFontSize = getPxNumber(resumeStyling?.fontSize);
  const columnFontSizeOffset = columnStyling?.fontSizeOffset ?? 0;
  const sectionFontSizeOffset = sectionStyling?.fontSizeOffset ?? 0;
  const subsectionFontSizeOffset = subsectionStyling?.fontSizeOffset ?? 0;
  const fieldFontSizeOffset = fieldStyling?.fontSizeOffset ?? 0;
  const leafFontSizeOffset = leafStyling?.fontSizeOffset ?? 0;

  return resumeFontSize + columnFontSizeOffset + sectionFontSizeOffset + subsectionFontSizeOffset + fieldFontSizeOffset + leafFontSizeOffset;
};

export const getCascadedLineHeight = ({
  resumeStyling,
  columnStyling = {},
  sectionStyling = {},
  subsectionStyling = {},
  fieldStyling = {},
  leafStyling = {},
}) => {
  const resumeLineHeight = getNumber(resumeStyling?.lineHeight, 1.2);
  const columnLineHeightOffset = getNumber(columnStyling?.lineHeightOffset, 0);
  const sectionLineHeightOffset = getNumber(sectionStyling?.lineHeightOffset, 0);
  const subsectionLineHeightOffset = getNumber(subsectionStyling?.lineHeightOffset, 0);
  const fieldLineHeightOffset = getNumber(fieldStyling?.lineHeightOffset, 0);
  const leafLineHeightOffset = getNumber(leafStyling?.lineHeightOffset, 0);

  return roundToTenth(
    resumeLineHeight +
    columnLineHeightOffset +
    sectionLineHeightOffset +
    subsectionLineHeightOffset +
    fieldLineHeightOffset +
    leafLineHeightOffset
  );
};

const Leaf = ({ attributes, children, leaf, resumeStyling, columnStyling = {}, sectionStyling = {}, subsectionStyling = {}, fieldStyling = {} }) => {
  const fontSize = getCascadedFontSize({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
    leafStyling: leaf,
  });
  const lineHeight = getCascadedLineHeight({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
    leafStyling: leaf,
  });

  const stylingObj = {
    display: 'inline-block',
    fontSize: `${fontSize}px`,
    lineHeight,
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
