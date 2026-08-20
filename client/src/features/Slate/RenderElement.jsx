import React from 'react';
import { getFaIcon } from '@/lib/iconLibrary';

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
      case 'icon': {
         const Icon = getFaIcon(element.iconId);

         if (!Icon) {
            return (
               <span {...attributes} >
                  {children}
               </span>
            );
         }

         return (
            <span
               {...attributes}
               contentEditable={false}
               style={{
                  // display: 'inline-flex',
                  alignItems: 'center',
                  verticalAlign: 'baseline',
                  color: 'inherit',
                  color: element.iconColor ?? 'currentColor',
                  fontSize: element.iconSize ?? '1em',
                  lineHeight: 1,
               }}
            >
               <Icon aria-hidden='true' focusable='false' />
               {children}
            </span>
         )
      }
      case 'paragraph':
         return <p {...attributes} style={stylingObj}>{children}</p>
      case 'heading':
         return <h2 {...attributes} style={stylingObj}>{children}</h2>
      default:
         return <p {...attributes} style={stylingObj}>{children}</p>
   }
}

export default RenderElement;