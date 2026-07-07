import { getCascadedFontSize, getCascadedLineHeight } from '@/helpers/leafHelpers';
import React from 'react';



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

  const color = leaf?.color || fieldStyling?.color || subsectionStyling?.color || sectionStyling?.color || columnStyling?.color || resumeStyling?.color;

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

  if (leaf.link) {
    console.log(leaf.link)
    stylingObj.cursor = 'pointer'
    styledChildren = <a target="_blank" href={leaf.link} style={{cursor: 'pointer'}}>{styledChildren}</a>
    // rel="noopener noreferrer" 
    // styledChildren = <Link to={leaf.link} styles={{cursor: 'pointer'}}>{styledChildren}</Link>
  }

  return <span {...attributes} style={stylingObj}>{styledChildren}</span>;
};

export default Leaf;
