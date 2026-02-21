import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useSections } from "./hooks/useSections";
import { useFormatting } from "./hooks/useFormatting";


import Page from "./components/Page/Page";
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


  useEffect(() => {
    sections.forEach(section => {
      if (section.columnIndex >= numColumns) {
        updateSection(section.id, { columnIndex: numColumns - 1 });
      }
    });
  }, [numColumns]);

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
                      {...section}
                      // key={section.id}
                      // id={section.id}
                      // index={index}
                      // totalSections={sections.length}
                      // content={section.content}
                      // fontSize={section.fontSize}
                      // textAlign={section.textAlign}
                      // backgroundColor={section.backgroundColor}
                      // autoFocus={section.autoFocus}
                      // formatting={formatting}
                      // updateSection={updateSection}
                      // handleReorder={reorderSections}
                      // handleDelete={deleteSection}
                      // {...section}
                    />
                  ))}
              </div>
            ))}
          </div>
          {/* {sections.map((section, index) => (
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
            formatting={formatting}
            updateSection={updateSection}
            handleReorder={reorderSections}
            handleDelete={deleteSection}
            />
          ))} */}
        </Page>
    </div>
  );
}