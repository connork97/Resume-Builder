const renderLeaf = (props) => {
  const { attributes, children, leaf } = props;

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

  if (leaf.fontSize) {
    styledChildren = <span style={{ fontSize: leaf.fontSize }}>{styledChildren}</span>;
  }

  if (leaf.fontColor) {
    styledChildren = <span style={{ color: leaf.fontColor }}>{styledChildren}</span>;
  }

  return <span {...attributes}>{styledChildren}</span>;
}

export default renderLeaf;