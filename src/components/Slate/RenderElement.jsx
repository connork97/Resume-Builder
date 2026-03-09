import React from 'react';

const RenderElement = ({ attributes, children, type, styling }) => {
   // console.log(attributes, children)
   switch (type) {
      case 'unordered-list':
         return <ul {...attributes}>{children}</ul>
      case 'ordered-list':
         return <ol {...attributes}>{children}</ol>
      case 'list-item':
         return (
            <li {...attributes}>
               {children}
               {/* <p>{children}</p> */}
            </li>
         )
      default:
         return <p {...attributes}>{children}</p>
   }
}

export default RenderElement;