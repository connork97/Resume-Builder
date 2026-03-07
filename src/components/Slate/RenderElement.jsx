import React from 'react';

const RenderElement = ({ attributes, children, type, styling }) => {
   // console.log(attributes, children)
   switch (type) {
      case 'bulleted-list':
         return <ul {...attributes} >{children}</ul>
      case 'numbered-list':
         return <ol {...attributes} >{children}</ol>
      case 'list-item':
         return <li {...attributes} style={{marginLeft: '1rem'}}>{children}</li>
      default:
         return <p {...attributes} style={styling}>{children}</p>
   }
}

export default RenderElement;