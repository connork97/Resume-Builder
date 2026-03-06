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

  if (leaf.color) {
    styledChildren = <span style={{ color: leaf.color }}>{styledChildren}</span>;
  }

  if (leaf.fontSize) {
    styledChildren = (
      <span style={{ fontSize: leaf.fontSize }}>{styledChildren}</span>
    );
  }

  return <span {...attributes}>{styledChildren}</span>;
}

export default renderLeaf;


  // const renderLeaf = useCallback((props) => {
  //   let { children, attributes, leaf } = props;

  //   if (leaf.bold) {
  //     children = <strong>{children}</strong>;
  //   }

  //   return <span {...attributes}>{children}</span>;
  // }, []);