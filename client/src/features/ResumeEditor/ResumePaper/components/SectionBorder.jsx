import React from "react";

const SectionBorder = ({ sectionBorder={}, borderSide }) => {
   const borderStyling = {}
   if (borderSide === 'bottom' || borderSide === 'top') {
      borderStyling.left = sectionBorder.width ? (100 - parseFloat(sectionBorder.width)) / 2 + '%' : 0,
      borderStyling.height = sectionBorder.height || 0,
      borderStyling.outlineWidth = '15px';
      borderStyling.outlineStyle = sectionBorder.style || 'solid',
      borderStyling.outlineColor = sectionBorder.color || 'rgba(0, 0, 0, 1)',
      borderStyling.backgroundColor = sectionBorder.color || 'rgba(0, 0, 0, 0)';
   }
   if (borderSide === 'bottom') {
      borderStyling.bottom = sectionBorder.height ? `-${parseFloat(sectionBorder.height) / 2}px` : 0
   }
   if (borderSide === 'top') {
      borderStyling.top = sectionBorder.height ? `-${parseFloat(sectionBorder.height) / 2}px` : 0
   }
      borderStyling.width = `calc(${sectionBorder.width} - ${borderStyling.outlineWidth} * 2)` || '100%'
      borderStyling.left = `calc(${borderStyling.left} + ${borderStyling.outlineWidth})`

   console.log('section border width: ', borderStyling.width, 'left: ', borderStyling.left)
  return (
    <div
      style={{
         ...borderStyling,
        position: "absolute",
        margin: "auto",
        zIndex: 1,
      }}
    />
  );
};

export default SectionBorder;
