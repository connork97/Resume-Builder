import { Editor, Transforms, Path, Element as SlateElement } from "slate";
import { LIST_TYPES } from "./blocks";

export const addListItem = (editor, listItemEntry) => {

  const [, listItemPath] = listItemEntry;

  if (!listItemPath) return;

  const newListItem = {
    type: "list-item",
    children: [
      // {
      //   type: "paragraph",
      //   children: [{ text: "" }],
      // },
    ],
  };

  const newPath = Path.next(listItemPath);

  Transforms.insertNodes(editor, newListItem, { at: newPath });

  Transforms.select(editor, Editor.start(editor, newPath));
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
    console.error("Cannot indent list any further.");
    //  May change to just converting back to paragraph
  }
};