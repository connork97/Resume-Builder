import React from "react";
import { useSelector } from "react-redux";

import LineHeight from "@/features/ResumeEditor/TextFormatting/LineHeight.jsx";
import FontSize from "@/features/ResumeEditor/TextFormatting/FontSize.jsx";
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
import ResetStyling from "./ResetStyling.jsx";
import Indentation from "../../TextFormatting/Indentation.jsx";
import UndoRedo from "./UndoRedo.jsx";

const RichTextToolbar = ({ editor }) => {
  const isMobile = window.innerWidth <= 768;
  const resumeStyling = useSelector((state) => state.resume.present.styling);
  const sections = useSelector((state) => state.resume.present.sections);
  const columns = useSelector((state) => state.resume.present.columns);
  const fields = useSelector((state) => state.resume.present.fields);
  const subsections = useSelector((state) => state.resume.present.subsections);

  const activeSectionIds = useSelector(
    (state) => state.resume.present.activeSectionIds,
  );
  const activeSectionId = activeSectionIds[0] ?? null;
  const activeEditorId = useSelector(
    (state) => state.resume.present.activeEditorId,
  );
  const selection = useSelector(
    (state) => state.resume.present.activeEditorSelection,
  );

  return (
    <div className={styles.richTextToolbarContainer}>
      <div className={styles.richTextToolbarWrapper}>
        <LineHeight
          editor={editor}
          selection={selection}
          fields={fields}
          subsections={subsections}
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
          activeEditorId={activeEditorId}
          resumeStyling={resumeStyling}
        />

        <FontColor
          editor={editor}
          selection={selection}
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
        />

        <HighlightColor editor={editor} selection={selection} />

        <BackgroundColor
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
        />

        <FontSize
          editor={editor}
          selection={selection}
          sections={sections}
          columns={columns}
          fields={fields}
          subsections={subsections}
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
          activeEditorId={activeEditorId}
          resumeStyling={resumeStyling}
        />

        <FontFamily />

        <Marks editor={editor} />

        <TextAlign
          editor={editor}
          selection={selection}
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
        />

        <Lists editor={editor} />

        <Indentation />

        <Links editor={editor} selection={selection} />

        <Icons editor={editor} />

        <Columns label="Columns:" />

        {/* <div data-toolbar-label="Section Gap" style={{ display: "contents" }}>
          <Gap label="Section Gap:" gapType="vertical" />
          </div>
          
          <div data-toolbar-label="Column Gap" style={{ display: "contents" }}>
          <Gap label="Column Gap:" gapType="horizontal" />
        </div> */}

        <Borders
          activeSectionId={activeSectionId}
          activeSectionIds={activeSectionIds}
        />

        <Gap />

        <AddSection />
        <ResetStyling />
        <UndoRedo />
      </div>
    </div>
  );
};

export default RichTextToolbar;
