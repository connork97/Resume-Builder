import { Editor, Element, Range, Transforms } from "slate";

import { store } from "../store/store.js";

const getResumeStyling = (style) => {
  const state = store.getState();
  const resumeStyling = state.resume.styling;
  return resumeStyling[style];
}

const getActiveEditorColor = (editor) => {
  const activeMarkColor = Editor.marks(editor)?.color;

  if (activeMarkColor) {
    return activeMarkColor;
  }

  const state = store.getState();
  const activeEditorId = state.resume.activeEditorId;
  const activeField = state.resume.fields.byId[activeEditorId];
  const activeSection =
    state.resume.sections.byId[activeEditorId] ||
    state.resume.sections.byId[state.resume.activeSectionIds[0]];
  const activeSubsection = state.resume.subsections.byId[activeField?.subsectionId];
  const activeColumn = state.resume.columns.byId[activeSection?.columnId];

  return (
    activeField?.styling?.color ||
    activeSubsection?.styling?.color ||
    activeSection?.styling?.color ||
    activeColumn?.styling?.color ||
    getResumeStyling('color')
  );
};

const syncIconColorsInSelection = (editor, color) => {
  if (!editor.selection || !Range.isExpanded(editor.selection)) {
    return;
  }

  Transforms.setNodes(
    editor,
    { iconColor: color },
    {
      at: editor.selection,
      match: (node) => Element.isElement(node) && node.type === 'icon',
      split: true,
    },
  );
};
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
    let parsedMark;
    switch (mark) {
      case ('fontFamily'):
        return activeMark ?? console.error("No active font family found.");
      case ('fontSize'):
        parsedMark = parseInt(activeMark)
        return parsedMark ?? console.error("No active font size found.");
      case ('fontSizeOffset'):
        parsedMark = parseInt(activeMark)
        return parsedMark ?? console.error("No active font size offset found.");
      case ('lineHeight'):
        parsedMark = parseFloat(activeMark).toFixed(1);
        return parsedMark ?? console.error("No active line height found.");
      case ('lineHeightOffset'):
        parsedMark = parseFloat(activeMark).toFixed(1)
        return parsedMark ?? console.error("No active line height offset found.");
      case ('color'):
        return activeMark ?? console.error("No active font color found.");
      case ('link'):
        return activeMark ?? null
    }
  }
  if (!activeMark) {
    switch (mark) {
      case ('fontFamily'):
        return getResumeStyling('fontFamily');
      case ('fontSize'):
        return parseInt(getResumeStyling('fontSize'));
      case('fontSizeOffset'):
        return 0;
      case ('color'):
        return;
        // return getResumeStyling('color');
      case ('lineHeight'):
        // const resumeLineHeight = getResumeStyling('lineHeight');
        return parseFloat(getResumeStyling('lineHeight')).toFixed(1);
      case ('lineHeightOffset'):
        return 0;
      default:
        return getResumeStyling(mark);
    }
  }
  // return activeMark;
};

export const setFontFamily = (editor, fontFamily) => {
  Editor.addMark(editor, 'fontFamily', fontFamily);
  console.log(`Font family set to ${fontFamily}`);
};

export const setFontSize = (editor, fontSize) => {
  // const parsedFontSize = parseInt(fontSize);
  // Editor.addMark(editor, 'fontSize', parsedFontSize);
  // console.log(`Font size set to ${parsedFontSize}`);
  Editor.addMark(editor, 'fontSize', `${fontSize}px`);
  console.log(`Font size set to ${fontSize}px`);
};

export const setFontSizeOffset = (editor, fontSizeOffset) => {
  const parsedFontSizeOffset = parseInt(fontSizeOffset);
  Editor.addMark(editor, 'fontSizeOffset', parsedFontSizeOffset);
  console.log(`Font size offset set to ${parsedFontSizeOffset}`);
};

export const setLineHeight = (editor, lineHeight) => {
  const parsedLineHeight = parseFloat(lineHeight).toFixed(1);
  Editor.addMark(editor, 'lineHeight', parsedLineHeight);
  console.log(`Line height set to ${parsedLineHeight}`);
}

export const setLineHeightOffset = (editor, lineHeightOffset) => {
  const parsedLineHeightOffset = parseFloat(lineHeightOffset).toFixed(1);
  Editor.addMark(editor, 'lineHeightOffset', parsedLineHeightOffset);
  console.log(`Line height offset set to ${parsedLineHeightOffset}`);
}

export const setFontColor = (editor, fontColor) => {
  Editor.addMark(editor, 'color', fontColor);
  syncIconColorsInSelection(editor, fontColor);
  console.log(`Color set to ${fontColor}`);
}

export const setHighlightColor = (editor, highlightColor) => {
  const transparentHighlightColor = highlightColor.replace(/, *1\)$/, ", 0.5)");
  Editor.addMark(editor, 'highlightColor', transparentHighlightColor);
  console.log(`Font highlightColor set to ${transparentHighlightColor}`);
}

export const setLink = (editor, link) => {
  if (!link) {
    Editor.removeMark(editor, 'link')
    Editor.removeMark(editor, 'bold')
    Editor.removeMark(editor, 'italic')
    Editor.removeMark(editor, 'underline')
    return;
  }
  Editor.addMark(editor, 'link', link);
  Editor.addMark(editor, 'bold', true);
  Editor.addMark(editor, 'italic', true);
  Editor.addMark(editor, 'underline', true);
}

export const setIcon = (editor, icon) => {
   if (!editor) {
      console.error("Editor instance is not available.");
      return;
   }

  if (!editor.selection) {
    return;
  }

  if (!icon) {
    // Backward compatibility for older documents that may still store icon as mark.
    Editor.removeMark(editor, 'icon');
    return;
  }

  if (Range.isExpanded(editor.selection)) {
    Transforms.collapse(editor, { edge: 'start' });
  }

  Transforms.insertNodes(editor, {
    type: 'icon',
    iconId: icon,
    iconColor: getActiveEditorColor(editor),
    children: [{ text: '' }],
  });
}
