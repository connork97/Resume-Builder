import { Editor } from "slate";

import { store } from "../../../store/store.js";

const getResumeStyling = (style) => {
  const state = store.getState();
  const resumeStyling = state.resume.styling;
  return resumeStyling[style];
}
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
  // if (!editor || !editor.selection) {
  // return null;
  // }
  const marks = Editor.marks(editor);
  const activeMark = marks?.[mark];
  if (activeMark) {
    switch (mark) {
      case ('fontSize'):
        const parsedActiveMark = parseInt(activeMark);
        // return parsedActiveMark;
        return parsedActiveMark ?? console.error("No active font size found.");
      case ('color'):
        return activeMark ?? console.error("No active font color found.");
    }
  }
  if (!activeMark) {
    switch (mark) {
      case ('fontSize'):
        return parseInt(getResumeStyling('fontSize'));
      case ('color'):
        return getResumeStyling('color');
      default:
        return activeMark;
    }
  }
  // return activeMark;
};

export const setFontSize = (editor, fontSize) => {
  // const parsedFontSize = parseInt(fontSize);
  // Editor.addMark(editor, 'fontSize', parsedFontSize);
  // console.log(`Font size set to ${parsedFontSize}`);
  Editor.addMark(editor, 'fontSize', `${fontSize}px`);
  console.log(`Font size set to ${fontSize}px`);
};

export const setFontColor = (editor, fontColor) => {
  Editor.addMark(editor, 'color', fontColor);
  console.log(`Color set to ${fontColor}`);
}

export const setHighlightColor = (editor, highlightColor) => {
  const transparentHighlightColor = highlightColor.replace(/, *1\)$/, ", 0.5)");
  Editor.addMark(editor, 'highlightColor', transparentHighlightColor);
  console.log(`Font highlightColor set to ${transparentHighlightColor}`);
}