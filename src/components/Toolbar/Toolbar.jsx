import TextFormatting from "./TextFormatting/TextFormatting";
import AddSection from "./AddSection/AddSection";
import Zoom from "./Zoom/Zoom";
import FontSize from "./Font/FontSize";
import FontColor from "./Font/FontColor";

import styles from "./Toolbar.module.css";
import { useFormatting } from "../../hooks/useFormatting";

export default function Toolbar({ addSection, updateSection, zoom, setZoom }) {
  const formatting = useFormatting(updateSection);

  return (
    <div className={styles.toolbar}>
      <TextFormatting formatting={formatting} />
      <FontSize formatting={formatting} />
      <FontColor formatting={formatting} />
      <Zoom zoom={zoom} setZoom={setZoom} />
      <AddSection addSection={addSection} />
    </div>
  );
}