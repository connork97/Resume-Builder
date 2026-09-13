import { Editor, Transforms, Range, Element as SlateElement } from "slate";
import { HistoryEditor } from "slate-history";
import { editList, selectedBlocks, withBlockRefs, indentItem, outdentItem } from "./listTransforms.js";

export const addListItem = (editor, listItemEntry) => {
  if (!editor.selection || !listItemEntry) return;

  const splitItem = () => Editor.withoutNormalizing(editor, () => {
    // Enter replaces selected text before splitting at the resulting caret.
    if (Range.isExpanded(editor.selection)) Transforms.delete(editor);

    // Resolve the item again: deleting a selection may have moved its path.
    Transforms.splitNodes(editor, {
      match: (node) => SlateElement.isElement(node) && node.type === "list-item",
      mode: "lowest",
      always: true,
    });
  });

  // Keep deletion and splitting together as one undoable Enter action.
  if (HistoryEditor.isHistoryEditor(editor)) {
    HistoryEditor.withNewBatch(editor, splitItem);
  } else {
    splitItem();
  }
};

export const indentList = (editor, listItemEntry) => {
  if (!editor.selection || !listItemEntry) return;
  editList(editor, () => withBlockRefs(editor, selectedBlocks(editor), refs => {
    for (const ref of refs) if (ref.current) indentItem(editor, ref.current);
  }));
};

export const outdentList = (editor, listItemEntry) => {
  if (!editor.selection || !listItemEntry) return;
  editList(editor, () => withBlockRefs(editor, selectedBlocks(editor), refs => {
    for (const ref of refs) if (ref.current) outdentItem(editor, ref.current);
  }));
};
