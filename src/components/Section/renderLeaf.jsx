import React from 'react';

const renderLeaf = (props) => {
  const { attributes, children, leaf } = props;

  const stylingObj = {
    display: 'inline-block',
    fontSize: leaf.fontSize ?? attributes.fontSize,
    lineHeight: leaf.lineHeight ?? attributes.lineHeight,
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