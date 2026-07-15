import React from 'react';

import { getActiveMark, setHighlightColor } from "../../../helpers/marks.js";

import ToolbarDropdown from "../EditorToolbar/components/shared/ToolbarDropdown.jsx";
import ColorDropdown from './shared/ColorDropdown.jsx';
import { PiHighlighterDuotone, PiHighlighterFill } from 'react-icons/pi';
import { FaHighlighter } from 'react-icons/fa';

const HighlightColor = ({ editor, selection }) => {

  const [currentEditorHighlightColor, setCurrentEditorHighlightColor] = React.useState("rgba(255, 255, 255, 0.1)");

  React.useEffect(() => {
    if (!editor || !selection) return;

    const currentHighlightColor = getActiveMark(editor, 'highlightColor');
    currentHighlightColor && setCurrentEditorHighlightColor(currentHighlightColor);
  }, [editor, selection])

  const setNewHighlightColor = (newHighlightColor = currentEditorHighlightColor) => {
    if (!editor) {
      window.alert("Please select text to highlight.");
      return;
    }
    setHighlightColor(editor, newHighlightColor);
    setCurrentEditorHighlightColor(newHighlightColor);
  }

  return (
    <ColorDropdown
      text={<FaHighlighter />}
      styling={{height: '5rem'}}
      // text="HC"
      editor={editor}
      selection={selection}
      currentEditorColor={currentEditorHighlightColor}
      handleSetColor={setNewHighlightColor}
    />
  )
}

export default HighlightColor;