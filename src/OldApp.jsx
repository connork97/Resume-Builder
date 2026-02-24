import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useSections } from "./hooks/useSections";
import { useFormatting } from "./hooks/useFormatting";


import Page from "./oldComponents/Page/Page";
import Toolbar from "./oldComponents/Toolbar/Toolbar";
import Section from "./oldComponents/Section/Section";

export default function App() {
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections
  } = useSections();

  const formatting = useFormatting(updateSection);

  const pageRef = useRef();

  const handleDownloadPDF = useReactToPrint({
    contentRef: pageRef,
    documentTitle: "document",
    removeAfterPrint: true
  });


  const [zoom, setZoom] = useState (0.75);

  const [numColumns, setNumColumns] = useState(1);

  const moveSectionLeft = (id, currentIndex) => {
    if (currentIndex > 0) {
      updateSection(id, undefined, undefined, undefined, undefined, currentIndex - 1);
    }
  };

  const moveSectionRight = (id, currentIndex) => {
    if (currentIndex < numColumns - 1) {
      updateSection(id, undefined, undefined, undefined, undefined, currentIndex + 1);
    }
  };


  /*  Checks each section to see if it is in a column that still exists when updating column number
  If in a column that was just deleted, the section gets moved to the last available column */
  useEffect(() => {
    sections.forEach(section => {
      if (section.columnIndex >= numColumns) {
        updateSection(
          section.id,
          undefined,
          undefined,
          undefined,
          undefined,
          numColumns - 1
        );
      }
    });
  }, [numColumns, sections]);

  return (
    <div>
      <Toolbar 
        formatting={formatting}
        addSection={addSection}
        updateSection={updateSection}
        zoom={zoom}
        setZoom={setZoom}
        onDownloadPDF={handleDownloadPDF}
        numColumns={numColumns}
        setNumColumns={setNumColumns}
      />
      <Page 
        ref={pageRef}
        zoom={zoom}
      >
        <div className="columnsContainer" style={{ "--num-columns": numColumns }}>
          {Array.from({ length: numColumns }).map((_, colIndex) => (
            <div className="column" key={colIndex}>
              {sections
                .filter(section => section.columnIndex === colIndex)
                .map((section, index) => (
                  <Section
                    key={section.id}
                    index={index}
                    totalSections={sections.length}
                    formatting={formatting}
                    updateSection={updateSection}
                    handleReorder={reorderSections}
                    handleDelete={deleteSection}
                    moveLeft={() => moveSectionLeft(section.id, section.columnIndex)}
                    moveRight={() => moveSectionRight(section.id, section.columnIndex)}
                    numColumns={numColumns}
                    setNumColumns={setNumColumns}
                    {...section}
                  />
                ))}
            </div>
          ))}
        </div>
      </Page>
    </div>
  );
}