import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditor, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withInlineVoidIcons } from '../src/helpers/slateHelpers/editorSchemaRules.js';

const makeEditor = () => {
  const editor = withHistory(withInlineVoidIcons(createEditor()));
  editor.children = [{ type: 'paragraph', children: [
    { text: 'Before ' },
    { type: 'icon', iconId: 'FaPhone', children: [{ text: '' }] },
    { text: ' after' },
  ] }];
  return editor;
};

test('icon-only size marks leave neighboring text unchanged', () => {
  const editor = makeEditor();
  Transforms.select(editor, { path: [0, 1, 0], offset: 0 });
  Editor.addMark(editor, 'fontSizeOffset', 6);
  assert.equal(editor.children[0].children[1].children[0].fontSizeOffset, 6);
  assert.equal(Editor.marks(editor).fontSizeOffset, 6);
  assert.equal(editor.children[0].children[0].fontSizeOffset, undefined);
  assert.equal(editor.children[0].children[2].fontSizeOffset, undefined);
});

test('whole-field formatting includes icons and supports undo and redo', () => {
  const editor = makeEditor();
  Transforms.select(editor, Editor.range(editor, []));
  Editor.addMark(editor, 'fontSizeOffset', 4);
  const children = editor.children[0].children;
  assert.equal(children[0].fontSizeOffset, 4);
  assert.equal(children[1].children[0].fontSizeOffset, 4);
  assert.equal(children[2].fontSizeOffset, 4);
  editor.undo();
  assert.equal(editor.children[0].children[1].children[0].fontSizeOffset, undefined);
  editor.redo();
  assert.equal(editor.children[0].children[1].children[0].fontSizeOffset, 4);
});
