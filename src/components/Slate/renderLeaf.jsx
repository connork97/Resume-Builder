import React from 'react';
import { useSelector } from 'react-redux';

const renderLeaf = (props) => {
  const { attributes, children, leaf } = props;
  const resumeStyling = useSelector((state) => state.resume.styling);

  const stylingObj = {
    display: 'inline-block',
    fontSize: leaf.fontSize || resumeStyling.fontSize,
    color: leaf.color || resumeStyling.color,
    backgroundColor: leaf.highlightColor,
    lineHeight: leaf.lineHeight || resumeStyling.lineHeight,
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

  if (leaf.fontSize || leaf.color || leaf.highlightColor) {
    styledChildren = <span {...attributes} style={stylingObj}>{styledChildren}</span>;
  }

  return <span {...attributes}>{styledChildren}</span>;
}

export default renderLeaf;