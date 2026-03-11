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

export const getActiveMark = (editor, mark) => {
  if (!editor || !editor.selection) return "?";
  const marks = Editor.marks(editor);
  const activeMark = marks?.[mark];
  switch(mark) {
    case ('fontSize'):
      const parsedActiveMark = parseInt(activeMark);
      return parsedActiveMark ?? "?";
    case ('fontColor'):
      return activeMark ?? console.error("No active font color found.");
  }
  return activeMark;
};

export const setFontSize = (editor, fontSize) => {
  const parsedFontSize = parseInt(fontSize);
  Editor.addMark(editor, 'fontSize', parsedFontSize);
  console.log(`Font size set to ${parsedFontSize}`);
};



export const setFontColor = (editor, fontColor) => {
  Editor.addMark(editor, 'fontColor', fontColor);
  console.log(`Font fontColor set to ${fontColor}`);
}