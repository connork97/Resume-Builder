import React from "react";

const SectionBorder = ({ sectionBorder = {}, borderSide }) => {
  const borderStyling = {};
  if (borderSide === "bottom" || borderSide === "top") {
    borderStyling.left = sectionBorder.width
      ? `calc(${100 - parseFloat(sectionBorder.width)}% / 2 + ${sectionBorder.height} / 2)`
      : 0;

    borderStyling.width =
      `calc(${sectionBorder.width} - ${sectionBorder.height || 0})` || "100%";
    borderStyling.outlineWidth =
      parseFloat(sectionBorder.height) / 2 + "px" || "1px";
    borderStyling.height = 0;
  }
  if (borderSide === "bottom") {
    borderStyling.bottom = '-2px'
  }
  if (borderSide === "top") {
    borderStyling.top = 0
  }

  if (borderSide === "left" || borderSide === "right") {
    borderStyling.height = `calc(${sectionBorder.height} - ${sectionBorder.width} + 2px)` || '100%';
    borderStyling.width = 0;
    borderStyling.outlineWidth = `calc(${sectionBorder.width} / 2)` || '1px';
    borderStyling.top = `calc(${sectionBorder.width} / 2 + (100% - ${sectionBorder.height}) / 2)`
  }

  if (borderSide === "left") {
    borderStyling.left = 0;
  }

  if (borderSide === 'right') {
    borderStyling.right = 0;
  }

  borderStyling.outlineStyle = sectionBorder.style || "solid";
  borderStyling.outlineColor = sectionBorder.color || "rgba(0, 0, 0, 1)";

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
