import { Editor, Path, Transforms, Element as SlateElement } from "slate";

import { LIST_TYPES, isList, isListItem, editList, selectedBlocks, withBlockRefs, outdentItem } from './listTransforms.js';
export { LIST_TYPES };

export const isBlockActive = (editor, format) => {
   const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
   });
   return !!match;
};

export const toggleList = (editor, format) => {
  if (!editor.selection || !LIST_TYPES.includes(format)) return;
  const paths = selectedBlocks(editor);
  if (!paths.length) return;
  const turnOff = paths.every(path => {
    const [node] = Editor.node(editor, path);
    const [parent] = Editor.parent(editor, path);
    return isListItem(node) && parent.type === format;
  });

  editList(editor, () => withBlockRefs(editor, paths, refs => {
    for (const ref of refs) {
      if (!ref.current) continue;
      const [node] = Editor.node(editor, ref.current);
      if (isListItem(node)) {
        if (turnOff) {
          // Leave every list level when the list button is toggled off.
          while (ref.current && isListItem(Editor.node(editor, ref.current)[0])) {
            if (!outdentItem(editor, ref.current)) break;
          }
          continue;
        }
        const [parent, parentPath] = Editor.parent(editor, ref.current);
        if (isList(parent)) {
          if (parent.type === format) continue;
          // Split the list container at item boundaries, never within its text.
          Transforms.unwrapNodes(editor, {
            at: Editor.range(editor, ref.current),
            match: (_, path) => Path.equals(path, parentPath),
            split: true,
          });
        }
      }
      Transforms.setNodes(editor, { type: 'list-item' }, { at: ref.current });
      const path = ref.current;
      const previousPath = path.at(-1) > 0 ? Path.previous(path) : null;
      const previous = previousPath && Editor.node(editor, previousPath)[0];
      if (previous?.type === format) {
        Transforms.moveNodes(editor, { at: path, to: [...previousPath, previous.children.length] });
      } else {
        Transforms.wrapNodes(editor, { type: format, children: [] }, { at: path });
      }
    }
  }));
};

export const getActiveAlignment = (editor) => {
  if (!editor?.selection) return null;

  const [match] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.textAlign,
    mode: "lowest",
  });

  return match ? match[0].textAlign : null;
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