import React from 'react';

import { getActiveMark, setHighlightColor } from "../../helpers/marks.js";

import ToolbarDropdown from "../Toolbar/ToolbarDropdown.jsx";

const HighlightColor = ({ editor, selection }) => {

  const [currentEditorHighlightColor, setCurrentEditorHighlightColor] = React.useState("rgba(255, 255, 255, 0.5)");

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
    <ToolbarDropdown
      text="HC"
      handleSetColor={setNewHighlightColor}
    />
  )
}

export default HighlightColor;