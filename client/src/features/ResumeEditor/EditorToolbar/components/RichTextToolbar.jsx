import React from "react";
import { useSelector } from "react-redux";


import LineHeight from '@/features/ResumeEditor/TextFormatting/LineHeight.jsx';
import FontSize from '@/features/ResumeEditor/TextFormatting/FontSize.jsx';
import FontColor from "@/features/ResumeEditor/TextFormatting/FontColor.jsx";
import HighlightColor from "@/features/ResumeEditor/TextFormatting/HighlightColor.jsx";
import BackgroundColor from "@/features/ResumeEditor/TextFormatting/BackgroundColor.jsx";
import TextAlign from "@/features/ResumeEditor/TextFormatting/TextAlign.jsx";
import Lists from "@/features/ResumeEditor/TextFormatting/Lists.jsx";
import Marks from "@/features/ResumeEditor/TextFormatting/Marks.jsx";

import Columns from "./Columns.jsx";
import Gap from "./Gap.jsx";
import Links from "../../TextFormatting/Links.jsx";
import Icons from "../../TextFormatting/Icons.jsx";
import Borders from "./Borders.jsx";

import styles from "../Toolbar.module.css";
import FontFamily from "../../TextFormatting/FontFamily.jsx";
import AddSection from "./AddSection.jsx";

const RichTextToolbar = ({ editor }) => {

  const resumeStyling = useSelector((state) => state.resume.styling);
  const sections = useSelector((state) => state.resume.sections);
  const columns = useSelector((state) => state.resume.columns);
  const fields = useSelector((state) => state.resume.fields);
  const subsections = useSelector((state) => state.resume.subsections);
  const activeSectionId = useSelector(state => state.resume.activeSectionId);
  const activeEditorId = useSelector(state => state.resume.activeEditorId);
  const selection = useSelector(state => state.resume.activeEditorSelection);

  return (
    <div className={styles.richTextToolbarContainer}>

      <div className={styles.richTextToolbarWrapper}>
        <LineHeight
          editor={editor}
          selection={selection}
          fields={fields}
          subsections={subsections}
          activeSectionId={activeSectionId}
          activeEditorId={activeEditorId}
          resumeStyling={resumeStyling}
        />

        <FontColor
          editor={editor}
          selection={selection}
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
          editor={editor}
          selection={selection}
          sections={sections}
          columns={columns}
          fields={fields}
          subsections={subsections}
          activeSectionId={activeSectionId}
          activeEditorId={activeEditorId}
          resumeStyling={resumeStyling}
        />

        <FontFamily />

        <Marks editor={editor} />

        <TextAlign
          editor={editor}
          activeSectionId={activeSectionId}
        />

        <Lists editor={editor} />

        <Links editor={editor} />

        <Icons editor={editor} />

        <Columns label="Columns:" />

        <Gap label="Section Gap:" gapType='vertical' />

        <Gap label="Column Gap:" gapType='horizontal' />

        <Borders />
          <AddSection />

      </div>
    </div>
  );
};

export default RichTextToolbar;
