import { Editor, Transforms, Path, Range, Element as SlateElement } from "slate";
import { HistoryEditor } from "slate-history";
import { LIST_TYPES } from "./blocks.js";

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
  
  const [, listItemPath] = listItemEntry;

  if (!listItemPath) return;

  const [parentList] = Editor.parent(editor, listItemPath);
  const parentListType = parentList.type;

  // Wrap the current list item in a new list based on the parent's list type
  Transforms.wrapNodes(
    editor,
    { type: parentListType, children: [] },
    { at: listItemPath }
  );
};

export const outdentList = (editor, listItemEntry) => {

  const [, listItemPath] = listItemEntry;
  
  if (!listItemPath) return;

  const grandparentPath = Path.parent(Path.parent(listItemPath));
  const [grandparentNode] = Editor.node(editor, grandparentPath);
  // Check if list item is at the first level before outdenting further
  if (LIST_TYPES.includes(grandparentNode.type)) {
    Transforms.liftNodes(editor, { at: listItemPath });
  } else {
    console.error("Cannot outdent list any further.");
    //  May change to just converting back to paragraph
  }
};