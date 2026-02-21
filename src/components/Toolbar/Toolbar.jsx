import TextFormatting from "./SectionFormatting/TextFormatting";
import AddSection from "./AddSection/AddSection";
import Zoom from "./Zoom/Zoom";
import FontSize from "./SectionFormatting/FontSize";
import FontColor from "./SectionFormatting/FontColor";
import TextAlign from "./SectionFormatting/TextAlign";
import BackgroundColor from "./SectionFormatting/BackgroundColor";

import styles from "./Toolbar.module.css";
// import { useFormatting } from "../../hooks/useFormatting";

export default function Toolbar({ addSection, updateSection, formatting, zoom, setZoom, numColumns, setNumColumns, onDownloadPDF }) {
  // const formatting = useFormatting(updateSection);

  return (
    <div className={styles.toolbar}>
      <TextFormatting formatting={formatting} />
      <FontSize formatting={formatting} />
      <FontColor formatting={formatting} />
      <TextAlign formatting={formatting} />
      <Zoom zoom={zoom} setZoom={setZoom} />
      <AddSection addSection={addSection} />
      <BackgroundColor formatting={formatting} />
      <select value={numColumns} onChange={e => setNumColumns(Number(e.target.value))}>
        <option value={1}>1 Column</option>
        <option value={2}>2 Columns</option>
        <option value={3}>3 Columns</option>
      </select>
      <button onClick={() => onDownloadPDF()}>
        Download PDF
      </button>

    </div>
  );
}