import { Editor } from "slate";

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const getActiveFontSize = (editor) => {
  if (!editor || !editor.selection) return "?";
  const marks = Editor.marks(editor);
  const fontSize = marks?.fontSize;
  const parsedFontSize = parseInt(fontSize);
  return parsedFontSize ?? "?";
};

export const setFontSize = (editor, fontSize) => {
  Editor.addMark(editor, 'fontSize', `${fontSize}px`)
};

export const incrementFontSize = (editor) => {
  let currentFontSize = getActiveFontSize(editor);
  let fontSizeToNum = parseInt(currentFontSize);
  console.log(fontSizeToNum)
  setFontSize(editor, fontSizeToNum + 1);
  // console.log(currentParsedFontSize)
};

export const decrementFontSize = (editor) => {
  let currentFontSize = getActiveFontSize(editor);
  let parsedFontSize = parseFloat(currentFontSize).toFixed(2);
  setFontSize(editor, parsedFontSize - 1);
;}