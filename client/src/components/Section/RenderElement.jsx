import React from 'react';

const RenderElement = ({ element, attributes, children, type }) => {
   
   const stylingObj = {
      textAlign: element.textAlign,
      minWidth: children.length + 'px'
   }

   switch (type) {
      case 'unordered-list':
         return <ul {...attributes} style={stylingObj}>{children}</ul>
      case 'ordered-list':
         return <ol {...attributes} style={stylingObj}>{children}</ol>
      case 'list-item':
         return <li {...attributes} style={stylingObj}>{children}</li>
      case 'paragraph':
         return <p {...attributes} style={{...stylingObj, minWidth: 'auto'}}>{children}</p>
      case 'heading':
         return <h2 {...attributes} style={stylingObj}>{children}</h2>
      default:
         return <p {...attributes} style={stylingObj}>{children}</p>
   }
}

export default RenderElement;