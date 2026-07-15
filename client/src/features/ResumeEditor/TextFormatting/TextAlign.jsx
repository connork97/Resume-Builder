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
import TextFormatDropdown from "./shared/TextFormatDropdown.jsx";

const TextAlign = ({ editor }) => {
  const dispatch = useDispatch();
  const resumeAlignment = useSelector((state) => state.resume?.styling?.textAlign);
  const activeEditorSelection = useSelector((state) => state.resume?.activeEditorSelection)
  const activeEditorAlignment = activeEditorSelection?.[0]?.textAlign;
  const activeEditorChildren = activeEditorSelection?.[0]?.children;
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const activeSectionAlignment = useSelector((state) => state.resume?.sections?.byId[activeSectionId]?.styling?.textAlign)
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

  const [showTextAlignDropdown, setShowTextAlignDropdown] = useState(false);
  const [alignmentIcon, setAlignmentIcon] = useState(<MdFormatAlignLeft style={{position: 'relative', top: '0.1em'}} />)

  const handleDropdownClick = () => {
    setShowTextAlignDropdown(!showTextAlignDropdown)
  }

  const handleSetAlignmentIcon = (alignment) => {
        if (alignment === 'center') setAlignmentIcon(<MdFormatAlignCenter style={{position: 'relative', top: '0.1em'}} />)
    else if (alignment === 'right') setAlignmentIcon(<MdFormatAlignRight style={{position: 'relative', top: '0.1em'}} />)
    else if (alignment === 'justify') setAlignmentIcon(<MdFormatAlignJustify style={{position: 'relative', top: '0.1em'}} />)
    else setAlignmentIcon(<MdFormatAlignLeft style={{position: 'relative', top: '0.1em'}} />)
  }

  const handleDropdownSelection = (alignment) => {
    setShowTextAlignDropdown(false);
    handleSetTextAlign(editor, alignment);
    handleSetAlignmentIcon(alignment);
  }

  useEffect(() => {
    // let activeEditorAlignment = true;
    // console.log('editor', editor)
    // if (!activeEditorAlignment && !activeSectionAlignment && !resumeAlignment && !activeEditorChildren) return;
    // let firstChildAlignment = false;
    // if (activeEditorChildren) {
    //   console.log(activeEditorChildren)
    //   activeEditorChildren.map(child => {
    //     console.log(child)
    //     if (child.textAlign) {
    //       console.log('CHILD TEXT ALIGN', child.textAlign)
    //       firstChildAlignment = child.textAlign;
    //       return;
    //     }
    //   })
    // }
    // console.log('first child', firstChildAlignment)
    // console.log(resumeAlignment, activeSectionAlignment, activeEditorAlignment, firstChildAlignment)
    if (!activeEditorAlignment && !activeSectionAlignment && resumeAlignment) return handleSetAlignmentIcon(resumeAlignment);
    else if (!activeEditorAlignment && activeSectionAlignment) return handleSetAlignmentIcon(activeSectionAlignment);
    else if (activeEditorAlignment) return handleSetAlignmentIcon(activeEditorAlignment);
    // else if (firstChildAlignment) return handleSetAlignmentIcon(firstChildAlignment);
    else return handleSetAlignmentIcon('left');
    
    // if (!activeEditorAlignment && activeSectionId) {

    // }
    // if (activeEditorAlignment) {

    // }
  // }, [activeSectionId])
  }, [editor, activeEditorAlignment, activeSectionId])

  const dropdownOptions = [
    {
      value: 'left',
      icon: <MdFormatAlignLeft />,
      command: () => handleDropdownSelection("left"),
    },
    {
      value: 'center',
      icon: <MdFormatAlignCenter />,
      command: () => handleDropdownSelection("center"),
    },
    {
      value: 'right',
      icon: <MdFormatAlignRight />,
      command: () => handleDropdownSelection("right"),
    },
    {
      value: 'justify',
      icon: <MdFormatAlignJustify />,
      command: () => handleDropdownSelection("justify"),
    },
  ]

  return (
    <div className={styles.toolbarFlexWrapper}>

      <button
        className={styles.textFormatButton}
        onClick={() => handleDropdownClick()}
        // onClick={() => handleSetTextAlign(editor, "left")}
        >
          {alignmentIcon}
        {/* <MdFormatAlignLeft style={{ position: "relative", top: "0.1em" }} /> */}
        <MdArrowDropDown style={{marginRight: '-0.5em'}} />
      </button>
      {showTextAlignDropdown && <TextFormatDropdown dropdownOptions={dropdownOptions} />}
        {/* 
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
      </button> */}
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
