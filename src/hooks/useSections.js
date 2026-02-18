import { useState } from "react";

export function useSections() {
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: "",
        fontSize: 12,
        textAlign: "left",
        autoFocus: true
      }
    ]);
  };

  const updateSection = (id, content, fontSize, textAlign) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id
          ? {
              ...section,
              content: content !== undefined ? content : section.content,
              fontSize: fontSize !== undefined ? fontSize : section.fontSize,
              textAlign: textAlign !== undefined ? textAlign : section.textAlign
            }
          : section
      )
    );
  };

  const deleteSection = (id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const reorderSections = (fromIndex, toIndex) => {
    setSections(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  return {
    sections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections
  };
}