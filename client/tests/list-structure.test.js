import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditor, Editor, Element, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withInlineVoidIcons } from '../src/helpers/slateHelpers/editorSchemaRules.js';
import { toggleList } from '../src/helpers/blocks.js';
import { indentList, outdentList, addListItem } from '../src/helpers/listBehavior.js';

const p = text => ({ type: 'paragraph', children: [{ text }] });
const li = text => ({ type: 'list-item', children: [{ text }] });
const list = (type, ...children) => ({ type, children });
const make = children => {
  const editor = withHistory(withInlineVoidIcons(createEditor()));
  editor.children = structuredClone(children);
  return editor;
};
const caret = (editor, path, offset = 0) => Transforms.select(editor, { path, offset });
const itemEntry = editor => Array.from(Editor.nodes(editor, { match: n => n.type === 'list-item', mode: 'lowest' }))[0];
const indent = editor => indentList(editor, itemEntry(editor));
const outdent = editor => outdentList(editor, itemEntry(editor));
const valid = editor => {
  for (const [node, path] of Node.elements(editor)) {
    if (!path.length) continue;
    assert.ok(node.type, 'No untyped wrappers');
    const [parent] = Editor.parent(editor, path);
    if (['ordered-list', 'unordered-list'].includes(node.type)) {
      assert.ok(!['paragraph', 'heading', 'ordered-list', 'unordered-list'].includes(parent.type));
      assert.ok(node.children.every(child => child.type === 'list-item'));
    }
    if (node.type === 'list-item') assert.ok(['ordered-list', 'unordered-list'].includes(parent.type));
    if (['paragraph', 'heading'].includes(node.type)) {
      assert.ok(node.children.every(child => !Element.isElement(child) || editor.isInline(child)));
    }
  }
};

for (const type of ['ordered-list', 'unordered-list']) {
  for (const offset of [0, 3, 6]) test(`${type}: caret toggle at ${offset} wraps complete text`, () => {
    const editor = make([p('abcdef')]);
    caret(editor, [0, 0], offset);
    for (let repeat = 0; repeat < 3; repeat++) {
      toggleList(editor, type);
      assert.deepEqual(editor.children, [list(type, li('abcdef'))]);
      assert.equal(editor.selection.anchor.offset, offset);
      indent(editor);
      assert.deepEqual(editor.children, [list(type, li('abcdef'))]);
      toggleList(editor, type);
      assert.deepEqual(editor.children, [p('abcdef')]);
      valid(editor);
    }
  });

  test(`${type}: partial multi-paragraph selection and undo`, () => {
    const original = [p('abc'), p('def'), p('ghi')];
    const editor = make(original);
    Transforms.select(editor, { anchor: { path: [0, 0], offset: 1 }, focus: { path: [1, 0], offset: 2 } });
    toggleList(editor, type);
    assert.deepEqual(editor.children, [list(type, li('abc'), li('def')), p('ghi')]);
    editor.undo();
    assert.deepEqual(editor.children, original);
    editor.redo();
    toggleList(editor, type);
    assert.deepEqual(editor.children, original);
  });

  test(`${type}: indent under preceding item, outdent, then become a paragraph`, () => {
    const editor = make([list(type, li('a'), li('b'), li('c'))]);
    caret(editor, [0, 1, 0], 1);
    indent(editor);
    assert.deepEqual(editor.children, [list(type, { type: 'list-item', children: [p('a'), list(type, li('b'))] }, li('c'))]);
    valid(editor);
    outdent(editor);
    assert.deepEqual(editor.children[0].children.map(Node.string), ['a', 'b', 'c']);
    valid(editor);
    outdent(editor);
    assert.deepEqual(editor.children.map(Node.string), ['a', 'b', 'c']);
    assert.equal(editor.children[1].type, 'paragraph');
    assert.equal(editor.children[0].type, type);
    assert.equal(editor.children[2].type, type);
    valid(editor);
  });

  test(`${type}: nested outdent preserves order of following items`, () => {
    const editor = make([list(type, { type: 'list-item', children: [p('a'), list(type, li('b'), li('c'))] }, li('d'))]);
    caret(editor, [0, 0, 1, 0, 0]);
    outdent(editor);
    assert.deepEqual(editor.children, [list(type,
      { type: 'list-item', children: [p('a')] },
      { type: 'list-item', children: [p('b'), list(type, li('c'))] }, li('d'))]);
    valid(editor);
    toggleList(editor, type);
    valid(editor);
    assert.equal(Node.string(editor), 'abcd');
  });

  test(`${type}: changing type affects only selected complete items`, () => {
    const other = type === 'ordered-list' ? 'unordered-list' : 'ordered-list';
    const editor = make([list(type, li('a'), li('abcdef'), li('z'))]);
    caret(editor, [0, 1, 0], 3);
    toggleList(editor, other);
    assert.deepEqual(editor.children, [list(type, li('a')), list(other, li('abcdef')), list(type, li('z'))]);
    valid(editor);
  });

  test(`${type}: Enter still splits a nested item`, () => {
    const editor = make([list(type, li('a'), li('bc'))]);
    caret(editor, [0, 1, 0], 1);
    indent(editor);
    addListItem(editor, itemEntry(editor));
    assert.deepEqual(editor.children[0].children[0].children[1].children.map(Node.string), ['b', 'c']);
    valid(editor);
  });

  test(`${type}: multi-item indentation/outdent keeps siblings together`, () => {
    const editor = make([list(type, li('a'), li('b'), li('c'), li('d'))]);
    Transforms.select(editor, { anchor: { path: [0, 1, 0], offset: 0 }, focus: { path: [0, 2, 0], offset: 1 } });
    indent(editor);
    assert.deepEqual(editor.children[0].children[0].children[1].children.map(Node.string), ['b', 'c']);
    valid(editor);
    outdent(editor);
    assert.deepEqual(editor.children[0].children.map(Node.string), ['a', 'b', 'c', 'd']);
    valid(editor);
  });

  test(`${type}: preserves marked text/icons, selection, and undo/redo`, () => {
    const icon = { type: 'icon', iconId: 'phone', children: [{ text: '', fontSizeOffset: 2 }] };
    const marked = { type: 'list-item', textAlign: 'right', children: [{ text: 'before', bold: true }, icon, { text: 'after' }] };
    const original = [list(type, li('a'), marked)];
    const editor = make(original);
    caret(editor, [0, 1, 0], 2);
    const selection = structuredClone(editor.selection);
    indent(editor);
    assert.deepEqual(editor.children[0].children[0].children[1].children[0], marked);
    const indented = structuredClone(editor.children);
    editor.undo();
    assert.deepEqual(editor.children, original);
    assert.deepEqual(editor.selection, selection);
    editor.redo();
    assert.deepEqual(editor.children, indented);
    valid(editor);
  });
}

test('an orphan list item cannot create an untyped wrapper when indented', () => {
  const editor = make([li('orphan')]);
  caret(editor, [0, 0]);
  indent(editor);
  assert.deepEqual(editor.children, [li('orphan')]);
  outdent(editor);
  assert.deepEqual(editor.children, [p('orphan')]);
});
