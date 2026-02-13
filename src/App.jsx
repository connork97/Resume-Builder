import { useState } from "react";

import styles from "./App.module.css";

import Toolbar from "./Components/Toolbar/Toolbar.jsx";
import Zoom from "./Components/Toolbar/Zoom.jsx";
import Paper from "./Components/Paper.jsx";

function App() {
  const [zoom, setZoom] = useState(1);

  return (
    <>
      <Toolbar>
        <Zoom zoom={zoom} setZoom={setZoom} />
      </Toolbar>

      <Paper scale={zoom}>
        <h1 className={styles.title}>Resume Title</h1>
      </Paper>
    </>
  );
}

export default App;