import { useState } from "react";

import styles from "./App.module.css";

import Toolbar from "./Components/Toolbar/Toolbar.jsx";
import Zoom from "./Components/Toolbar/Zoom.jsx";
import Paper from "./Components/Paper.jsx";
import AddSection from "./Components/Toolbar/AddSection.jsx";
import Section from "./Components/Section.jsx";

function App() {
  const [zoom, setZoom] = useState(1);

  const [sections, setSections] = useState([]);

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
        <Zoom zoom={zoom} setZoom={setZoom} />
        <AddSection addSection={addSection} />
      </Toolbar>

      <Paper scale={zoom}>
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