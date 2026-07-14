import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateResume, updateSection } from "@/store/resumeSlice.js";

import { setAlignment } from "@/helpers/blocks.js";

import TextFormatButton from "./shared/TextFormatButton.jsx";

import styles from "./TextFormatting.module.css";
import {
  MdArrowDropDown,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
} from "react-icons/md";

const TextAlign = ({ editor }) => {
  const dispatch = useDispatch();
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const activeSectionIds = useSelector(
    (state) => state.resume.activeSectionIds,
  );

  const handleSetTextAlign = (editor, alignment) => {
    if (activeSectionIds.length > 0) {
      for (let sectionId of activeSectionIds) {
        dispatch(
          updateSection({
            id: sectionId,
            changes: {
              styling: {
                textAlign: alignment,
              },
            },
          }),
        );
      }
    } else if (!editor && !activeSectionId) {
      dispatch(
        updateResume({
          key: "styling",
          changes: {
            textAlign: alignment,
          },
        }),
      );
      return;
    } else if (!editor && activeSectionId) {
      dispatch(
        updateSection({
          id: activeSectionId,
          changes: { styling: { textAlign: alignment } },
        }),
      );
      return;
    } else if (editor) {
      setAlignment(editor, alignment);
    }
  };

  return (
    <div className={styles.toolbarFlexWrapper}>
      <button
        className={styles.textFormatButton}
        onClick={() => handleSetTextAlign(editor, "left")}
      >
        <MdFormatAlignLeft style={{ position: "relative", top: "0.1em" }} />
      </button>
      <button
        className={styles.textFormatButton}
        onClick={() => handleSetTextAlign(editor, "center")}
      >
        <MdFormatAlignCenter style={{ position: "relative", top: "0.1em" }} />
      </button>
      <button
        className={styles.textFormatButton}
        onClick={() => handleSetTextAlign(editor, "right")}
      >
        <MdFormatAlignRight style={{ position: "relative", top: "0.1em" }} />
      </button>
      <button
        className={styles.textFormatButton}
        onClick={() => handleSetTextAlign(editor, "justify")}
      >
        <MdFormatAlignJustify style={{ position: "relative", top: "0.1em" }} />
      </button>
      {/* 
         <TextFormatButton
            text="C"
            command={() => handleSetTextAlign(editor, 'center')}
         />
         <TextFormatButton
            text="R"
            command={() => handleSetTextAlign(editor, 'right')}
         />
         <TextFormatButton
            text="J"
            command={() => handleSetTextAlign(editor, 'justify')}
         /> */}
    </div>
  );
};

export default TextAlign;
