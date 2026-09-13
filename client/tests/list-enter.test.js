import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditor, Editor, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withInlineVoidIcons } from '../src/helpers/slateHelpers/editorSchemaRules.js';
import { addListItem } from '../src/helpers/listBehavior.js';

const item = children => ({ type: 'list-item', children });
const setup = (type, children = [{ text: 'abcdef' }]) => {
  const editor = withHistory(withInlineVoidIcons(createEditor()));
  editor.children = [{ type, children: [item(children)] }];
  return editor;
};
const enter = editor => addListItem(editor, Editor.above(editor, {
  match: node => node.type === 'list-item',
}));

for (const type of ['ordered-list', 'unordered-list']) {
  for (const [offset, expected] of [[0, ['', 'abcdef']], [3, ['abc', 'def']], [6, ['abcdef', '']]]) {
    test(`${type}: Enter at offset ${offset} splits and moves the caret`, () => {
      const editor = setup(type);
      Transforms.select(editor, { path: [0, 0, 0], offset });
      enter(editor);
      assert.deepEqual(editor.children[0].children.map(Node.string), expected);
      assert.deepEqual(editor.selection, Editor.range(editor, Editor.start(editor, [0, 1])));
      assert.equal(editor.children[0].type, type);
    });
  }

  test(`${type}: selected text is replaced, and Enter has its own undo batch`, () => {
    const editor = setup(type);
    Transforms.select(editor, { path: [0, 0, 0], offset: 6 });
    editor.insertText('!');
    Transforms.select(editor, {
      anchor: { path: [0, 0, 0], offset: 2 },
      focus: { path: [0, 0, 0], offset: 4 },
    });
    const before = structuredClone(editor.children);
    const selection = structuredClone(editor.selection);
    enter(editor);
    assert.deepEqual(editor.children[0].children.map(Node.string), ['ab', 'ef!']);
    editor.undo();
    assert.deepEqual(editor.children, before);
    assert.deepEqual(editor.selection, selection);
    editor.redo();
    assert.deepEqual(editor.children[0].children.map(Node.string), ['ab', 'ef!']);
  });

  test(`${type}: splitting preserves marks and trailing inline icons`, () => {
    const icon = { type: 'icon', iconId: 'phone', children: [{ text: '', fontSizeOffset: 3 }] };
    const editor = setup(type, [{ text: 'abcdef', bold: true }, icon, { text: ' tail', italic: true }]);
    Transforms.select(editor, { path: [0, 0, 0], offset: 3 });
    enter(editor);
    assert.deepEqual(editor.children[0].children[0].children, [{ text: 'abc', bold: true }]);
    assert.deepEqual(editor.children[0].children[1].children, [
      { text: 'def', bold: true }, icon, { text: ' tail', italic: true },
    ]);
  });

  test(`${type}: an empty item still creates another item`, () => {
    const editor = setup(type, [{ text: '' }]);
    Transforms.select(editor, { path: [0, 0, 0], offset: 0 });
    enter(editor);
    assert.deepEqual(editor.children[0].children.map(Node.string), ['', '']);
  });
}
