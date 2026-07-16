import React from "react";

const SectionBorder = ({ sectionBorder = {}, borderSide }) => {
  const borderStyling = {};
  if (borderSide === "bottom" || borderSide === "top") {
    // borderStyling.height = sectionBorder.height || 0,
    borderStyling.left = sectionBorder.width
      ? `calc(${100 - parseFloat(sectionBorder.width)}% / 2 + ${sectionBorder.height} / 2)`
      : 0;

    borderStyling.width =
      `calc(${sectionBorder.width} - ${sectionBorder.height || 0})` || "100%";
    borderStyling.outlineWidth =
      parseFloat(sectionBorder.height) / 2 + "px" || "1px";
    borderStyling.outlineStyle = sectionBorder.style || "solid";
    borderStyling.outlineColor = sectionBorder.color || "rgba(0, 0, 0, 1)";
    // borderStyling.backgroundColor = sectionBorder.color || "rgba(0, 0, 0, 0)";
    borderStyling.backgroundColor = "rgba(0, 0, 0, 0)";
    borderStyling.height = 0;
  }
  if (borderSide === "bottom") {
    borderStyling.bottom = '-0.125rem'
  }
  if (borderSide === "top") {
    borderStyling.top = 0

  }
  // borderStyling.width = `calc(${sectionBorder.width} - ${borderStyling.width} * 2)` || '100%'
  // borderStyling.left = `calc(${borderStyling.left} + ${borderStyling.width})`

  if (sectionBorder.display) {
    return (
      <div
        style={{
          ...borderStyling,
          position: "absolute",
          margin: "auto",
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          zIndex: 1,
        }}
      />
    );
  }
  return null;
};

export default SectionBorder;
