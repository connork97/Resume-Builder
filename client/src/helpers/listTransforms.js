import { Editor, Element, Path, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';

export const LIST_TYPES = ['ordered-list', 'unordered-list'];
export const isList = node => Element.isElement(node) && LIST_TYPES.includes(node.type);
export const isListItem = node => Element.isElement(node) && node.type === 'list-item';

export const editList = (editor, fn) => {
  const edit = () => Editor.withoutNormalizing(editor, fn);
  if (HistoryEditor.isHistoryEditor(editor)) HistoryEditor.withNewBatch(editor, edit);
  else edit();
};

// Resolve complete blocks, including the containing item when its text is a paragraph.
export const selectedBlocks = editor => {
  if (!editor.selection) return [];
  const paths = [];
  for (const [node, path] of Editor.nodes(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: node => Element.isElement(node) && !editor.isInline(node) && Editor.hasInlines(editor, node),
  })) {
    const item = Editor.above(editor, { at: path, match: isListItem, mode: 'lowest' });
    const target = isListItem(node) ? path : item?.[1] ?? path;
    if (!paths.some(existing => Path.equals(existing, target))) paths.push(target);
  }
  return paths.filter(path => !paths.some(other => Path.isAncestor(other, path)));
};

export const withBlockRefs = (editor, paths, fn) => {
  const refs = paths.map(path => Editor.pathRef(editor, path));
  try {
    fn(refs);
  } finally {
    refs.forEach(ref => ref.unref());
  }
};

// Slate requires an item to contain either inline content or blocks, never both.
export const wrapItemText = (editor, path) => {
  const [item] = Editor.node(editor, path);
  if (!Editor.hasInlines(editor, item)) return;
  Transforms.wrapNodes(editor, { type: 'paragraph', children: [] }, {
    at: path,
    match: (node, childPath) => childPath.length === path.length + 1 &&
      Path.equals(Path.parent(childPath), path) &&
      (!Element.isElement(node) || editor.isInline(node)),
  });
};

const removeItemBullet = (editor, path) => {
  const [item] = Editor.node(editor, path);
  if (Editor.hasInlines(editor, item)) {
    Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
  } else {
    // Preserve item properties (such as alignment) when unwrapping block content.
    const { type: _type, children: _children, ...properties } = item;
    item.children.forEach((child, index) => {
      const missing = Object.fromEntries(Object.entries(properties).filter(([key]) => child[key] === undefined));
      if (Object.keys(missing).length) Transforms.setNodes(editor, missing, { at: [...path, index] });
    });
    Transforms.unwrapNodes(editor, { at: path });
  }
};

// Returns false for unsupported ancestry, allowing callers to stop safely.
export const outdentItem = (editor, path) => {
  const [item] = Editor.node(editor, path);
  if (!isListItem(item)) return false;
  const [list, listPath] = Editor.parent(editor, path);
  if (!isList(list)) {
    if (listPath.length) return false;
    removeItemBullet(editor, path); // Repair a legacy item at the editor root.
    return true;
  }
  const [owner, ownerPath] = Editor.parent(editor, listPath);

  if (isListItem(owner)) {
    const [outerList] = Editor.parent(editor, ownerPath);
    if (!isList(outerList)) return false;
    withBlockRefs(editor, [listPath, path], ([listRef, itemRef]) => {
      // Keep following siblings after the moved item in reading order.
      const count = list.children.length - path.at(-1) - 1;
      if (count) {
        wrapItemText(editor, itemRef.current);
        const [current] = Editor.node(editor, itemRef.current);
        const nestedPath = [...itemRef.current, current.children.length];
        Transforms.insertNodes(editor, { ...list, children: [] }, { at: nestedPath });
        for (let index = 0; index < count; index++) {
          Transforms.moveNodes(editor, { at: Path.next(itemRef.current), to: [...nestedPath, index] });
        }
      }
      Transforms.moveNodes(editor, { at: itemRef.current, to: Path.next(ownerPath) });
      const [remaining] = Editor.node(editor, listRef.current);
      if (!remaining.children.length) Transforms.removeNodes(editor, { at: listRef.current });
    });
  } else if (isList(owner)) {
    // Existing documents may still have the old list -> list -> item shape.
    Transforms.liftNodes(editor, { at: path });
  } else {
    withBlockRefs(editor, [path], ([ref]) => {
      // liftNodes splits the surrounding list around this complete item.
      Transforms.liftNodes(editor, { at: ref.current });
      removeItemBullet(editor, ref.current);
    });
  }
  return true;
};

export const indentItem = (editor, path) => {
  const [item] = Editor.node(editor, path);
  const [list] = Editor.parent(editor, path);
  if (!isListItem(item) || !isList(list) || path.at(-1) === 0) return;
  const previousPath = Path.previous(path);
  if (!isListItem(Editor.node(editor, previousPath)[0])) return;

  wrapItemText(editor, previousPath);
  const [previous] = Editor.node(editor, previousPath);
  const lastIndex = previous.children.length - 1;
  const last = previous.children[lastIndex];
  let nestedPath = [...previousPath, lastIndex];
  if (!isList(last) || last.type !== list.type) {
    nestedPath = [...previousPath, previous.children.length];
    Transforms.insertNodes(editor, { type: list.type, children: [] }, { at: nestedPath });
  }
  const [nested] = Editor.node(editor, nestedPath);
  Transforms.moveNodes(editor, { at: path, to: [...nestedPath, nested.children.length] });
};
