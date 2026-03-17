import React from 'react';
import { useSelector } from 'react-redux';
import { setLineHeight } from './helpers/marks';

const RenderElement = ({ element, attributes, children, type }) => {
   // console.log(attributes, children)
   const resumeStyling = useSelector((state) => state.resume.styling);
   
   // const stylingObj = {
      // fontSize: element.fontSize || resumeStyling.fontSize,
      // lineHeight: element.lineHeight || resumeStyling.lineHeight,
      // // gap: element.gap || resumeStyling.gap,
      // color: element.color || resumeStyling.color,
      // backgroundColor: element.backgroundColor || 'rgba(255, 255, 255, 0)',
      // textAlign: element.textAlign,
   // }
   const stylingObj = {
      // fontSize: element.fontSize,
      // lineHeight: element.lineHeight,
   }
   switch (type) {
      case 'unordered-list':
         return <ul {...attributes} style={stylingObj}>{children}</ul>
      case 'ordered-list':
         return <ol {...attributes} style={stylingObj}>{children}</ol>
      case 'list-item':
         return <li {...attributes} style={stylingObj}>{children}</li>
      case 'paragraph':
         return <p {...attributes} style={stylingObj}>{children}</p>
      case 'heading':
         return <h2 {...attributes} style={stylingObj}>{children}</h2>
      default:
         return <p {...attributes} style={stylingObj}>{children}</p>
   }
}

export default RenderElement;