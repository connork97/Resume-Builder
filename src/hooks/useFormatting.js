import { useEffect, useState, useRef } from "react";

export function useFormatting(updateSection) {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontColor: "#000000",
    fontSize: 16
  });

  const savedSelection = useRef(null);

  // Selection Save/Restore
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    sel.removeAllRanges();
    if (savedSelection.current) {
      sel.addRange(savedSelection.current);
    }
  };

  // Find the current section
  const findSection = (node) => {
    while (node && node !== document.body) {
      if (node.classList?.contains("section")) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  // Inline formatting (bold/italic/underline)
  const toggle = (command) => {
    restoreSelection();
    document.execCommand(command);
    updateActiveFormats();
  };

  // Block-level font size
  const applyFontSize = (px) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const section = findSection(range.startContainer);
    if (!section) return;

    const sectionId = section.getAttribute("data-id");
    updateSection(sectionId, undefined, px);

    updateActiveFormats();
  };

  // Detect current font size
  const getCurrentFontSizeFromSelection = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return 16;

    let node = sel.focusNode;
    if (!node) return 16;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    const section = findSection(node);
    if (!section) return 16;

    const computed = window.getComputedStyle(section);
    const size = computed.fontSize;

    return size && size.endsWith("px") ? parseFloat(size) : 16;
  };

  // Update active formatting state
  const updateActiveFormats = () => {
    const fontSize = getCurrentFontSizeFromSelection();

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      fontColor: document.queryCommandValue("foreColor"),
      fontSize
    });
  };

  // Listen for selection changes
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
    applyFontSize
  };
}