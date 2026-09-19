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
        <div data-toolbar-label="Line Height" style={{ display: "contents" }}>
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
        </div>

        <div data-toolbar-label="Font Color" style={{ display: "contents" }}>
          <FontColor
            editor={editor}
            selection={selection}
            activeSectionId={activeSectionId}
            activeSectionIds={activeSectionIds}
          />
        </div>

        <div
          data-toolbar-label="Highlight Color"
          style={{ display: "contents" }}
        >
          <HighlightColor editor={editor} selection={selection} />
        </div>

        <div
          data-toolbar-label="Background Color"
          style={{ display: "contents" }}
        >
          <BackgroundColor
            activeSectionId={activeSectionId}
            activeSectionIds={activeSectionIds}
          />
        </div>

        <div data-toolbar-label="Font Size" style={{ display: "contents" }}>
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
        </div>

        <div data-toolbar-label="Font Family" style={{ display: "contents" }}>
          <FontFamily />
        </div>

        <Marks editor={editor} />

        <div
          data-toolbar-label="Text Alignment"
          style={{ display: "contents" }}
        >
          <TextAlign
            editor={editor}
            selection={selection}
            activeSectionId={activeSectionId}
            activeSectionIds={activeSectionIds}
          />
        </div>

        <Lists editor={editor} />

        <Indentation />

        <div data-toolbar-label="Link" style={{ display: "contents" }}>
          <Links editor={editor} selection={selection} />
        </div>

        <div data-toolbar-label="Insert Icon" style={{ display: "contents" }}>
          <Icons editor={editor} />
        </div>

        <div data-toolbar-label="Columns" style={{ display: "contents" }}>
          <Columns label="Columns:" />
        </div>

        {/* <div data-toolbar-label="Section Gap" style={{ display: "contents" }}>
          <Gap label="Section Gap:" gapType="vertical" />
          </div>
          
          <div data-toolbar-label="Column Gap" style={{ display: "contents" }}>
          <Gap label="Column Gap:" gapType="horizontal" />
        </div> */}

        <div
          data-toolbar-label="Borders"
          data-id="open-close-dropdown-button"
          style={{ display: "contents" }}
        >
          <Borders
            activeSectionId={activeSectionId}
            activeSectionIds={activeSectionIds}
          />
        </div>

        <Gap />

        <div data-toolbar-label="Add Section" style={{ display: "contents" }}>
          <AddSection />
        </div>
        <ResetStyling />

      </div>
    </div>
  );
};

export default RichTextToolbar;
