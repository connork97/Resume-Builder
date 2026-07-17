import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { updateResume } from "@/store/resumeSlice.js";

import { MdArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";
import TextFormatDropdown from "./shared/TextFormatDropdown";

import styles from "./TextFormatting.module.css";

const FontFamily = ({ editor }) => {
  const dispatch = useDispatch();


  const fontFamilyStrings = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT",
  ];

  const [showDropdown, setShowDropdown] = useState(false);

  const handleFontFamilyChange = (fontFamily) => {
    console.log(
      "FontFamily.jsx: handleFontFamilyChange: fontFamily:",
      fontFamily,
    );
         dispatch(updateResume({
            key: 'styling',
            changes: {
               fontFamily: fontFamily
            }
         }));
    setShowDropdown(false);
  };

  const fontFamiliesArr = fontFamilyStrings.map((fontFamily) => {
    return (
      <p
        key={fontFamily}
        value={fontFamily}
        style={{
          fontFamily: fontFamily,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => handleFontFamilyChange(fontFamily)}
      >
        {fontFamily}

        {/* <div style={{position: 'absolute', marginTop: '5%', height: '1px', width: '80%', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}></div> */}
      </p>
    );
  });

  const selectedFontFamily = useSelector(
    (state) => state.resume.styling.fontFamily ?? fontFamilyStrings[0],
  );

  return (
    <div
        style={{whiteSpace: 'nowrap'}}
    >
      <button
        className="buttonMain"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedFontFamily}
        <MdArrowDropDown style={{ margin: "auto -0.25rem auto 0.25rem" }} />
      </button>
      {showDropdown && (
        <TextFormatDropdown
          dropdownOptions={fontFamiliesArr}
          wrapperClassName="flexColumn"
        />
      )}
    </div>
  );
};

export default FontFamily;
