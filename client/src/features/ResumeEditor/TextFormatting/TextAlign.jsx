import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateResume, updateSection } from "@/store/resumeSlice.js";

import { setAlignment, getActiveAlignment } from "@/helpers/blocks.js";


import styles from "./TextFormatting.module.css";
import {
  MdArrowDropDown,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
} from "react-icons/md";
import TextFormatDropdown from "./shared/TextFormatDropdown.jsx";

const TextAlign = ({ editor, selection, activeSectionId, activeSectionIds }) => {
  const dispatch = useDispatch();
  const resumeAlignment = useSelector((state) => state.resume?.styling?.textAlign);
  const activeEditorSelection = useSelector((state) => state.resume?.activeEditorSelection)
  const activeEditorAlignment = editor ? getActiveAlignment(editor) : null;
//   const activeEditorAlignment = activeEditorSelection?.[0]?.textAlign;
  const activeEditorChildren = activeEditorSelection?.[0]?.children;
  const activeSectionAlignment = useSelector((state) => state.resume?.sections?.byId[activeSectionId]?.styling?.textAlign)

  const handleSetTextAlign = (editor, alignment) => {
    if (editor) {
      setAlignment(editor, alignment);
    } else if (activeSectionIds.length > 0) {
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
    } else {
      dispatch(
        updateResume({
          key: "styling",
          changes: {
            textAlign: alignment,
          },
        }),
      );
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
    if (!activeEditorAlignment && !activeSectionAlignment && resumeAlignment) return handleSetAlignmentIcon(resumeAlignment);
    else if (!activeEditorAlignment && activeSectionAlignment) return handleSetAlignmentIcon(activeSectionAlignment);
    else if (activeEditorAlignment) return handleSetAlignmentIcon(activeEditorAlignment);
    else return handleSetAlignmentIcon('left');
  }, [editor, activeEditorAlignment, activeSectionId, selection])

  const dropdownOptions = [
    {
      value: 'left',
      elements: [<button className="buttonMain" onClick={() => handleDropdownSelection("left")}><MdFormatAlignLeft /></button>],
      command: () => handleDropdownSelection("left"),
    },
    {
      value: 'center',
      elements: [<button className="buttonMain" onClick={() => handleDropdownSelection("center")}><MdFormatAlignCenter /></button>],
      command: () => handleDropdownSelection("center"),
    },
    {
      value: 'right',
      elements: [<button className="buttonMain" onClick={() => handleDropdownSelection("right")}><MdFormatAlignRight /></button>],
      command: () => handleDropdownSelection("right"),
    },
    {
      value: 'justify',
      elements: [<button className="buttonMain" onClick={() => handleDropdownSelection("justify")}><MdFormatAlignJustify /></button>],
      command: () => handleDropdownSelection("justify"),
    },
  ]

  return (
    <div className={styles.toolbarFlexWrapper}>

      <button
        className='buttonMain'
        onClick={() => handleDropdownClick()}
        >
          {alignmentIcon}
        <MdArrowDropDown style={{marginRight: '-0.5em'}} />
      </button>
      {showTextAlignDropdown && <TextFormatDropdown isOpen={showTextAlignDropdown} setIsOpen={setShowTextAlignDropdown} dropdownOptions={dropdownOptions} />}
    </div>
  );
};

export default TextAlign;
