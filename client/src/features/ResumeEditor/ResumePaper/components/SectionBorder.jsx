import React from "react";

const SectionBorder = ({ sectionBorder={}, borderSide }) => {
   const borderStyling = {}
   if (borderSide === 'bottom' || borderSide === 'top') {
      borderStyling.left = sectionBorder.width ? (100 - parseFloat(sectionBorder.width)) / 2 + '%' : 0,
      borderStyling.height = sectionBorder.height || 0,
      borderStyling.width = sectionBorder.width || '100%'
      borderStyling.outlineWidth = '1px';
      borderStyling.outlineStyle = sectionBorder.style || 'solid',
      borderStyling.outlineColor = sectionBorder.color || 'rgba(0, 0, 0, 1)',
      borderStyling.backgroundColor = sectionBorder.color || 'rgba(0, 0, 0, 1)';
   }
   if (borderSide === 'bottom') {
      borderStyling.bottom = sectionBorder.height ? `-${parseFloat(sectionBorder.height) / 2}px` : 0
   }
   if (borderSide === 'top') {
      borderStyling.top = sectionBorder.height ? `-${parseFloat(sectionBorder.height) / 2}px` : 0
   }
  return (
    <div
      style={{
         ...borderStyling,
        position: "absolute",
        margin: "auto",
      //   left: sectionBorder.bottom.width
      //     ? (100 - parseFloat(sectionBorder.bottom.width)) / 2 + "%"
      //     : 0,
      //   bottom: sectionBorder.bottom.height
      //     ? `-${parseFloat(sectionBorder.bottom.height) / 2}px`
      //     : 0,
      //   height: sectionBorder.bottom.height || "0px",
      //   width: sectionBorder.bottom.width || "100%",
      //   outline: `1px solid`,
      //   backgroundColor: sectionBorder.bottom.color || "rgba(0, 0, 0, 1)",
        zIndex: 1,
      }}
    />
  );
};

export default SectionBorder;
