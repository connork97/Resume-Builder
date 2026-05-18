import React from 'react';

const RenderElement = ({ element, attributes, children, type }) => {
   
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