export const withInlineVoidIcons = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "icon" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "icon" ? true : isVoid(element);
  };

  // Let the font-size toolbar mark an icon's empty text child.
  editor.markableVoid = (element) => {
    return element.type === "icon" ? true : markableVoid(element);
  };

  return editor;
};