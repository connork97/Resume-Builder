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

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), content: "" }
    ]);
  };

  const updateSection = (id, newContent) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, content: newContent } : s
      )
    );
  };
  


  return (
    <>
      <Toolbar>
        <AddSection addSection={addSection} />
        <Zoom zoom={zoom} setZoom={setZoom} />
        <FontSize fontSize={fontSize} setFontSize={setFontSize} />
        <FontColor fontColor={fontColor} setFontColor={setFontColor} />
      </Toolbar>

      <Paper scale={zoom} fontSize={fontSize} fontColor={fontColor}>
        <h1 className={styles.title}>Resume Title</h1>
        <div className="contentWrapper">
          {sections.map((section) => (
            <Section
              key={section.id}
              id={section.id}
              content={section.content}
              updateSection={updateSection}
            />
          ))}
        </div>

      </Paper>
    </>
  );
}

export default App;