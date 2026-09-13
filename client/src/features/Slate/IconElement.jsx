import React, { useRef } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useFocused, useReadOnly, useSelected, useSlateStatic } from 'slate-react';
import { ICONS_MAP } from '@/lib/iconLibrary';
import styles from './IconElement.module.css';

const IconElement = ({ element, attributes, children, inheritedFontSize, inheritedLineHeight }) => {
   const editor = useSlateStatic();
   const selected = useSelected();
   const focused = useFocused();
   const readOnly = useReadOnly();
   const pointerStart = useRef(null);
   const Icon = ICONS_MAP[element.iconId];

   const handleClick = (event) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (readOnly) return;

      // Leave range selection and multiple clicks to the browser and Slate.
      const dragged = start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4;
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || dragged || !start) {
         // Avoid Slate's default void-click handler collapsing a dragged range.
         event.preventDefault();
         return;
      }
      if (event.button !== 0 || event.detail > 1) return;

      // Target this icon's empty text child, even when the SVG was clicked.
      event.preventDefault();
      const path = ReactEditor.findPath(editor, element);
      Transforms.select(editor, path);
      ReactEditor.focus(editor);
   };

   return (
      <span
         {...attributes}
         contentEditable={false}
         data-section-dnd-exclude="true"
         className={selected && focused ? styles.selected : undefined}
         onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
         }}
         onPointerCancel={() => { pointerStart.current = null; }}
         onClick={handleClick}
         style={{
            display: 'inline-block',
            verticalAlign: 'bottom',
            color: element.iconColor ?? 'currentColor',
            fontSize: `${inheritedFontSize + (element.children[0]?.fontSizeOffset ?? 0)}px`,
            lineHeight:  1,
         }}
      >
         {children}
         {Icon && <Icon aria-hidden="true" focusable="false" />}
      </span>
   );
};

export default IconElement;
