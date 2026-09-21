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

import FontFamily from "../../TextFormatting/FontFamily.jsx";
import AddSection from "./AddSection.jsx";
import ResetStyling from "./ResetStyling.jsx";
import Indentation from "../../TextFormatting/Indentation.jsx";
import UndoRedo from "./UndoRedo.jsx";

import styles from "../Toolbar.module.css";

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

  const lineHeightComponent = (
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
  );
  const fontSizeComponent = (
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
  );
  const fontColorComponent = (
    <FontColor
      editor={editor}
      selection={selection}
      activeSectionId={activeSectionId}
      activeSectionIds={activeSectionIds}
    />
  );
  const highlightColorComponent = (
    <HighlightColor editor={editor} selection={selection} />
  );
  const backgroundColorComponent = (
    <BackgroundColor
      activeSectionId={activeSectionId}
      activeSectionIds={activeSectionIds}
    />
  );
  const fontFamilyComponent = <FontFamily />;
  const marksComponent = <Marks editor={editor} />;
  const linksComponent = <Links editor={editor} selection={selection} />;
  const iconsComponent = <Icons editor={editor} />;   
  const columnsComponent = <Columns label="Columns:" />;
  const textAlignComponent = (
    <TextAlign
      editor={editor}
      selection={selection}
      activeSectionId={activeSectionId}
      activeSectionIds={activeSectionIds}
    />
  );
  const listsComponent = <Lists editor={editor} />;
  const indentationComponent = <Indentation />;
  const resetStylingComponent = <ResetStyling />;
  const undoRedoComponent = <UndoRedo />;
  const bordersComponent = (
    <Borders
      activeSectionId={activeSectionId}
      activeSectionIds={activeSectionIds}
    />
  );
  const gapComponent = <Gap />;
  const addSectionComponent = <AddSection />;

  if (isMobile) {
   return (
      <div className={styles.richTextToolbarContainer}>
        <div className={styles.richTextToolbarWrapper}>
         <div className={styles.mobileToolbarRow}>

          {lineHeightComponent}
          {fontSizeComponent}
          {fontFamilyComponent}
          {fontColorComponent}
          {marksComponent}
         </div>
         <div className={styles.mobileToolbarRow}>
          {textAlignComponent}
          {listsComponent}
          {indentationComponent}
          {backgroundColorComponent}
          {highlightColorComponent}
          {linksComponent}
          {iconsComponent}
         </div>
         <div className={styles.mobileToolbarRow}>
          {columnsComponent}
          {gapComponent}
          {bordersComponent}
          {addSectionComponent}
          {resetStylingComponent}
          {undoRedoComponent}
         </div>
        </div>
      </div>
   )
  }

  return (
    <div className={styles.richTextToolbarContainer}>
      <div className={styles.richTextToolbarWrapper}>
        {lineHeightComponent}
        {fontColorComponent}
        {highlightColorComponent}
        {backgroundColorComponent}
        {fontSizeComponent}
        {fontFamilyComponent}
        {marksComponent}
        {textAlignComponent}
        {listsComponent}
        {indentationComponent}
        {linksComponent}
        {iconsComponent}
        {columnsComponent}
        {/* <div data-toolbar-label="Section Gap" style={{ display: "contents" }}>
          <Gap label="Section Gap:" gapType="vertical" />
          </div>
          <div data-toolbar-label="Column Gap" style={{ display: "contents" }}>
          <Gap label="Column Gap:" gapType="horizontal" />
        </div> */}
        {gapComponent}
        {bordersComponent}
        {gapComponent}
        {addSectionComponent}
        {resetStylingComponent}
        {undoRedoComponent}
      </div>
    </div>
  );
};

export default RichTextToolbar;
