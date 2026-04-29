import React, { useEffect } from "react";
import { useSelector } from "react-redux";



import LineHeight from '../Formatting/LineHeight.jsx';
import FontSize from '../Formatting/FontSize.jsx';
import FontColor from "../Formatting/FontColor.jsx";
import HighlightColor from "../Formatting/HighlightColor.jsx";
import BackgroundColor from "../Formatting/BackgroundColor.jsx";
import TextAlign from "../Formatting/TextAlign.jsx";
import Lists from "../Formatting/Lists.jsx";
import Marks from "../Formatting/Marks.jsx";
import Columns from "./Columns.jsx";
import CurrentlyEditing from "./CurrentlyEditing.jsx";
import AddSection from "./AddSection.jsx";

import styles from "./RichTextToolbar.module.css";

const RichTextToolbar = ({ editor }) => {

  const resumeStyling = useSelector((state) => state.resume.styling);
  const sections = useSelector((state) => state.resume.sections);
  const activeSectionId = useSelector(state => state.resume.activeSectionId);
  const selection = useSelector(state => state.resume.activeEditorSelection);

  // useEffect(() => {
  //   if (!editor || !selection) {
  //     console.error('Editor is not ready.');
  //     return;
  //   }
  //   console.log('Editor is ready.')
  // }, [editor, selection])


  return (

    <div className={styles.richTextToolbarWrapper}>
      <LineHeight
        label="Line Height"
        editor={editor}
        selection={selection}
        sections={sections}
        activeSectionId={activeSectionId}
        resumeStyling={resumeStyling}
      />

      <FontColor
        editor={editor}
        selection={selection}
        activeSectionId={activeSectionId}
      />

      <HighlightColor
        editor={editor}
        selection={selection}
        activeSectionId={activeSectionId}
      />

      <BackgroundColor
        activeSectionId={activeSectionId}
      />

      <FontSize
        label="Font Size"
        editor={editor}
        selection={selection}
        sections={sections}
        activeSectionId={activeSectionId}
        resumeStyling={resumeStyling}
      />

      <Marks editor={editor} />

      <TextAlign
        editor={editor}
        activeSectionId={activeSectionId}
      />

      <Lists editor={editor} />

      <Columns label="Columns" />
      
      {/* <div className={styles.belowToolbarWrapper}> */}
      <CurrentlyEditing editor={editor} />

      <AddSection />
      {/* </div> */}

    </div>
  );
};

export default RichTextToolbar;