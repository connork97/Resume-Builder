import React from 'react';

const RenderElement = ({ element, attributes, children, type }) => {
   // console.log(attributes, children)
   const stylingObj = {
      textAlign: element.textAlign,
      // fontSize: element.fontSize,
      // color: element.color,
      // backgroundColor: element.backgroundColor
   }
   switch (type) {
      case 'unordered-list':
         return <ul {...attributes}>{children}</ul>
      case 'ordered-list':
         return <ol {...attributes}>{children}</ol>
      case 'list-item':
         return <li {...attributes}>{children}</li>
      case 'paragraph':
         return <p {...attributes} style={stylingObj}>{children}</p>
      default:
         return <p {...attributes} style={stylingObj}>{children}</p>
   }
}

export default RenderElement;