const renderLeaf = (props) => {
  const { attributes, children, leaf } = props;

  const stylingObj = {
    fontSize: leaf.fontSize,
    color: leaf.fontColor,
    backgroundColor: leaf.highlightColor,
    display: 'inline-block',
    lineHeight: leaf.fontSize || '12px'
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

  if (leaf.fontSize || leaf.fontColor || leaf.highlightColor) {
    styledChildren = <span {...attributes} style={stylingObj}>{styledChildren}</span>;
  }

  return <span {...attributes}>{styledChildren}</span>;
}

export default renderLeaf;