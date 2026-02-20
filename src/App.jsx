import React, { useState } from "react";
import { useSections } from "./hooks/useSections";

import Paper from "./components/Paper/Paper";
import Toolbar from "./components/Toolbar/Toolbar";
import Section from "./components/Section/Section";

export default function App() {
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections
  } = useSections();

  const [zoom, setZoom] = useState (1);

  return (
    <div>
      <Toolbar 
        addSection={addSection}
        updateSection={updateSection}
        zoom={zoom}
        setZoom={setZoom}
      />
      <Paper zoom={zoom}>

      {sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          index={index}
          totalSections={sections.length}
          content={section.content}
          fontSize={section.fontSize}
          textAlign={section.textAlign}
          backgroundColor={section.backgroundColor}
          autoFocus={section.autoFocus}
          updateSection={updateSection}
          handleReorder={reorderSections}
          handleDelete={deleteSection}
        />
      ))}
      </Paper>
    </div>
  );
}