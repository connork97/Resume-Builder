import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { updateResume } from "@/store/resumeSlice.js";

import { MdArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";
import TextFormatDropdown from "./shared/TextFormatDropdown";

const FontFamily = () => {
  const dispatch = useDispatch();

  const fontFamilies = [
    { label: "Aptos", value: "Aptos, Arial, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Avenir Next", value: "'Avenir Next', Arial, sans-serif" },
    { label: "Calibri", value: "Calibri, Arial, sans-serif" },
    { label: "Cambria", value: "Cambria, Georgia, serif" },
    { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Garamond", value: "Garamond, Georgia, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
    { label: "Inter", value: "'Inter', Arial, sans-serif" },
    { label: "Lato", value: "'Lato', Arial, sans-serif" },
    { label: "Libre Baskerville", value: "'Libre Baskerville', Georgia, serif" },
    { label: "Merriweather", value: "'Merriweather', Georgia, serif" },
    { label: "Montserrat", value: "'Montserrat', Arial, sans-serif" },
    { label: "Noto Sans", value: "'Noto Sans', Arial, sans-serif" },
    { label: "Open Sans", value: "'Open Sans', Arial, sans-serif" },
    { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
    { label: "PT Sans", value: "'PT Sans', Arial, sans-serif" },
    { label: "PT Serif", value: "'PT Serif', Georgia, serif" },
    { label: "Roboto", value: "'Roboto', Arial, sans-serif" },
    { label: "Roboto Condensed", value: "'Roboto Condensed', Arial, sans-serif" },
    { label: "Source Sans 3", value: "'Source Sans 3', Arial, sans-serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  const [showDropdown, setShowDropdown] = useState(false);

  const handleFontFamilyChange = (fontFamily) => {
    console.log(
      "FontFamily.jsx: handleFontFamilyChange: fontFamily:",
      fontFamily,
    );
    dispatch(
      updateResume({
        key: "styling",
        changes: {
          fontFamily,
        },
      }),
    );
    setShowDropdown(false);
  };

  const fontFamiliesArr = fontFamilies.map((fontFamily) => {
    return (
      <p
        key={fontFamily.label}
        value={fontFamily.value}
        style={{
          fontFamily: fontFamily.value,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => handleFontFamilyChange(fontFamily.value)}
      >
        {fontFamily.label}

        {/* <div style={{position: 'absolute', marginTop: '5%', height: '1px', width: '80%', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}></div> */}
      </p>
    );
  });

  const selectedFontFamily = useSelector(
    (state) => state.resume.styling.fontFamily ?? fontFamilies[0].value,
  );
  const selectedFontFamilyLabel =
    fontFamilies.find((fontFamily) => fontFamily.value === selectedFontFamily)
      ?.label ?? selectedFontFamily;

  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <button
        className="buttonMain"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedFontFamilyLabel}
        <MdArrowDropDown style={{ margin: "auto -0.25rem auto 0.25rem" }} />
      </button>
      {showDropdown && (
        <TextFormatDropdown
          dropdownOptions={fontFamiliesArr}
            containerStyling={{ height: '30rem', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent' }}
          wrapperClassName="flexColumn"
        />
      )}
    </div>
  );
};

export default FontFamily;
