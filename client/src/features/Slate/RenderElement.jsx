import React from 'react';
import { useSelector } from 'react-redux';
import IconElement from './IconElement';

const RenderElement = ({ element, attributes, children, type, inheritedFontSize, inheritedLineHeight, field }) => {
   
   const reduxResume = useSelector((state) => state.resume.present);
   const resumeGap = reduxResume.layout.gap;
   console.log('RENDER ELEMENT FIELD: ', field);
   const fieldSubsection = reduxResume.subsections.byId[field?.subsectionId];
   const isLastFieldInSubsection = field?.id === fieldSubsection?.fieldIds?.slice[fieldSubsection.fieldIds.length - 1];

   const stylingObj = {
      textAlign: element.textAlign,
      paddingLeft: (type === 'unordered-list' || type === 'ordered-list') && "var(--list-padding-left-default)"
   }

   switch (type) {
      case 'unordered-list':
         return <ul {...attributes} style={stylingObj}>{children}</ul>
      case 'ordered-list':
         return <ol {...attributes} style={stylingObj}>{children}</ol>
      case 'list-item':
         return <li {...attributes} style={{...stylingObj, marginBottom: !isLastFieldInSubsection ? (resumeGap.field || '0rem') : '0rem'}}>{children}</li>
      case 'icon':
         return (
            <IconElement
               element={element}
               attributes={attributes}
               inheritedFontSize={inheritedFontSize}
               inheritedLineHeight={inheritedLineHeight}
            >
               {children}
            </IconElement>
         );
      case 'paragraph':
         return <p {...attributes} style={stylingObj}>{children}</p>
      case 'heading':
         return <h2 {...attributes} style={stylingObj}>{children}</h2>
      default:
         return <p {...attributes} style={stylingObj}>{children}</p>
   }
}

export default RenderElement;