import { Editor, Transforms, Element as SlateElement } from "slate";

export const LIST_TYPES = ["ordered-list", "unordered-list"];

export const isBlockActive = (editor, format) => {
   const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
   });
   return !!match;
};

export const toggleList = (editor, format) => {
   const isActive = isBlockActive(editor, format);
   const isList = LIST_TYPES.includes(format);

   // Unwrap existing lists
   Transforms.unwrapNodes(editor, {
      match: n => LIST_TYPES.includes(n.type),
      split: true,
   });

   // Toggle block type
   const newType = isActive
      ? "paragraph"
      : isList
         ? "list-item"
         : format;

   Transforms.setNodes(
      editor,
      // { alignment: format },
      { type: newType }
   );

   // Wrap list items in parent list
   if (!isActive && isList) {
      const block = { type: format, children: [] };
      // Transforms.wrapNodes(editor, block);
      Transforms.wrapNodes(editor, block, {
         match: n => n.type === "list-item",
         split: true,
      });

   }
   // console.log("THIS ONE", JSON.stringify(editor.children, null, 2));
};

export const setAlignment = (editor, alignment) => {
   Transforms.setNodes(
      editor,
      { textAlign: alignment },
      {
         match: (n) => SlateElement.isElement(n),
         split: false,
      }
   );
};