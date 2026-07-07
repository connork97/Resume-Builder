import {
  getCascadedFontSize,
  getCascadedLineHeight,
} from "@/helpers/leafHelpers";
import React from "react";

import { getFaIcon } from "@/lib/iconLibrary";

const Leaf = ({
  attributes,
  children,
  leaf,
  resumeStyling,
  columnStyling = {},
  sectionStyling = {},
  subsectionStyling = {},
  fieldStyling = {},
}) => {
  const fontSize = getCascadedFontSize({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
    leafStyling: leaf,
  });
  const lineHeight = getCascadedLineHeight({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
    leafStyling: leaf,
  });

  const stylingObj = {
    display: "inline-block",
    fontSize: `${fontSize}px`,
    lineHeight,
    color: leaf.color,
    backgroundColor: leaf.highlightColor,
  };

  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  if (leaf.strikeThrough) {
    styledChildren = <s>{styledChildren}</s>;
  }

  if (leaf.link) {
    stylingObj.cursor = "pointer";
    styledChildren = (
      <a 
        target="_blank"
        href={leaf.link}
        style={{
          cursor: "pointer",
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25em'
        }}
      >
        {/* <LinkIcon
          aria-hidden='true'
          style={{
            fontSize: '0.9em',
            flexShrink: 0
          }}
        /> */}
        {styledChildren}
      </a>
    );
  }

  if (leaf.icon) {
    const Icon = getFaIcon(leaf.icon);

    if (!Icon) {
      return (
        <span {...attributes} style={stylingObj}>
          {styledChildren}
        </span>
      );
    }

    return (
      <span {...attributes} style={{...stylingObj, display: 'inline-flex', alignItems: 'center'}}>
        <Icon style={{ fontSize: '1em', marginRight: '0.5em'}} />
        {/* {React.createElement(Icon, {
          style: { fontSize: '1em', marginRight: '0.5em' },
        })} */}
        {styledChildren}
      </span>
    )
  }

  return (
    <span {...attributes} style={stylingObj}>
      {styledChildren}
    </span>
  );
};

export default Leaf;
