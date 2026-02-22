import TextFormatting from "./SectionFormatting/TextFormatting";
import AddSection from "./AddSection/AddSection";
import Zoom from "./Zoom/Zoom";
import FontSize from "./SectionFormatting/FontSize";
import FontColor from "./SectionFormatting/FontColor";
import TextAlign from "./SectionFormatting/TextAlign";
import BackgroundColor from "./SectionFormatting/BackgroundColor";
import ToolbarButton from "./SectionFormatting/ToolbarButton";
import ColumnsDropdown from "./ColumnsDropdown";

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
      <ColumnsDropdown numColumns={numColumns} setNumColumns={setNumColumns}  className={styles.container} />
      <ToolbarButton onClick={() => onDownloadPDF()}>
        Download PDF
      </ToolbarButton>

    </div>
  );
}