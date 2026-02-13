import { useState } from "react";

import styles from "./App.module.css";

import Paper from "./Components/Paper.jsx";
import Toolbar from "./Components/Toolbar/Toolbar.jsx";
import Zoom from "./Components/Toolbar/Zoom.jsx";
import AddSection from "./Components/Toolbar/AddSection.jsx";
import Section from "./Components/Section.jsx";
import FontSize from "./Components/Toolbar/FontSize.jsx";
import FontColor from "./Components/Toolbar/FontColor";

function App() {

  const [sections, setSections] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState("#000000");

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), content: "", autoFocus: true }
    ]);
  };

  const updateSection = (id, newContent) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, content: newContent } : s
      )
    );
  };
  
  const handleReorder = (fromIndex, toIndex) => {
    setSections((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  return (
    <>
      <Toolbar>
        <AddSection handleAddSection={handleAddSection} />
        <Zoom zoom={zoom} setZoom={setZoom} />
        <FontSize fontSize={fontSize} setFontSize={setFontSize} />
        <FontColor fontColor={fontColor} setFontColor={setFontColor} />
      </Toolbar>

<Paper scale={zoom} fontSize={fontSize} fontColor={fontColor}>
  <div className="contentWrapper">
    {sections.map((section, index) => (
      <Section
        key={section.id}
        id={section.id}
        index={index}
        content={section.content}
        updateSection={updateSection}
        autoFocus={section.autoFocus}
        handleReorder={handleReorder}
      />
    ))}
  </div>
</Paper>

    </>
  );
}

export default App;