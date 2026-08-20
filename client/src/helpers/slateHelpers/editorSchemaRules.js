export const withInlineVoidIcons = (editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "icon" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "icon" ? true : isVoid(element);
  };

  return editor;
};