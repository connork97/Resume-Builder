import { useEffect, useState, useRef } from "react";

export function useFormatting(updateSection) {

  //  Tracks current format for selected section, keeping the toolbar in sync with each individual section
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontColor: "#000000",
    fontSize: 12,
    textAlign: "left",
    backgroundColor: "#ffffff"
  });

  const savedSelection = useRef(null);

  //  Saves the cursor position while editing/formatting a section's content in the toolbar
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  //  Restores the cursor to its prior position after editing/formatting via the toolbar
  const restoreSelection = () => {
    const sel = window.getSelection();
    sel.removeAllRanges();
    if (savedSelection.current) {
      sel.addRange(savedSelection.current);
    }
  };

  //  Finds/determines which section formatting should be applied to
  const findSection = (node) => {
    while (node && node !== document.body) {
      if (node.dataset?.id) return node;
      node = node.parentNode;
    }
    return null;
  };

  //  Restores selection and applies inline formatting (bold/italicize/underline)
  const toggle = (command) => {
    restoreSelection();
    document.execCommand(command);
    updateActiveFormats();
  };

  //  Applies section specific, block level formatting
  const applySectionFormatting = (formatType, value) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const section = findSection(sel.focusNode);
    if (!section) return;

    const id = section.dataset.id;

    switch (formatType) {
      case "fontSize":
        updateSection(id, undefined, value);
        break;
      case "textAlign":
        updateSection(id, undefined, undefined, value);
        break;
      case "backgroundColor":
        updateSection(id, undefined, undefined, undefined, value);
        break;
      default:
        console.error(`Invalid format type (${formatType}) and/or value (${value}) passed to applySectionFormatting() in useFormatting.js`);
    }
    updateActiveFormats();
  };

  //  Used to convert RGB colors to Hex when necessary
  const rgbToHex = (rgb) => {
    const match = rgb.match(/\d+/g);
    if (!match) return rgb;
    const [r, g, b] = match.map(Number);
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  };

  // Reads the computed font size from the section currently selected by the cursor, keeping the toolbar's font size input in sync
  const getCurrentFontSizeFromSelection = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return 12;

    let node = sel.focusNode;
    if (!node) return 12;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    const section = findSection(node);
    if (!section) return 12;

    const computed = window.getComputedStyle(section);
    const size = computed.fontSize;

    return size && size.endsWith("px") ? parseFloat(size) : 12;
  };

  //  Final application/update of formatting changes
  const updateActiveFormats = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const section = findSection(sel.focusNode);
    const computed = section ? window.getComputedStyle(section) : null;

    const fontSize = getCurrentFontSizeFromSelection();

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      fontColor: document.queryCommandValue("foreColor"),
      fontSize,
      textAlign: computed ? computed.textAlign : "left",
      backgroundColor: computed ? computed.backgroundColor : "#ffffff"
    });
  };

  //  Global selection listener:  Updates the toolbar to section specific styling when the user selects a new section with the cursor
  useEffect(() => {
    const handler = () => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        return;
      }
      updateActiveFormats();
    };

    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  return {
    activeFormats,
    toggle,
    saveSelection,
    restoreSelection,
    applySectionFormatting
  };
}