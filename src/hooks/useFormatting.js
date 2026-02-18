import { useEffect, useState, useRef } from "react";

export function useFormatting(updateSection) {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontColor: "#000000",
    fontSize: 16,
    textAlign: "left"
  });

  const savedSelection = useRef(null);

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

  const findSection = (node) => {
    while (node && node !== document.body) {
      if (node.dataset?.id) return node;
      node = node.parentNode;
    }
    return null;
  };

  const toggle = (command) => {
    restoreSelection();
    document.execCommand(command);
    updateActiveFormats();
  };

  const applyFontSize = (px) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const section = findSection(sel.focusNode);
    if (!section) return;

    const id = section.dataset.id;
    updateSection(id, undefined, px, undefined);

    updateActiveFormats();
  };

  const applyTextAlign = (alignment) => {
    saveSelection();
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const section = findSection(sel.focusNode);
    if (!section) return;

    const id = section.dataset.id;
    updateSection(id, undefined, undefined, alignment);

    updateActiveFormats();
  };

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
      textAlign: computed ? computed.textAlign : "left"
    });
  };

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
    applyFontSize,
    applyTextAlign
  };
}