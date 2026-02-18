import { useState } from "react";

export function useSections() {
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: "",
        fontSize: 16,      // ⭐ default font size
        autoFocus: true
      }
    ]);
  };

  const updateSection = (id, content, fontSize) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id
          ? {
              ...section,
              content: content !== undefined ? content : section.content,
              fontSize: fontSize !== undefined ? fontSize : section.fontSize
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