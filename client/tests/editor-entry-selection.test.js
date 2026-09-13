import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditor, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { selectOnEditorEntry } from '../src/helpers/slateHelpers/selectOnEditorEntry.js';

const setup = (t) => {
  const editor = createEditor();
  editor.children = [{ type: 'paragraph', children: [{ text: 'connorkormos@gmail.com' }] }];
  editor.selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 12 },
  };
  const point = { path: [0, 0], offset: 17 };
  t.mock.method(ReactEditor, 'isFocused', () => false);
  t.mock.method(ReactEditor, 'hasEditableTarget', () => true);
  t.mock.method(ReactEditor, 'findEventRange', () => ({ anchor: point, focus: point }));
  return { editor, point, event: { button: 0, detail: 1, target: {} } };
};

test('reentry replaces the previous word selection with the clicked caret', t => {
  const { editor, point, event } = setup(t);
  assert.equal(selectOnEditorEntry(editor, event), undefined);
  assert.ok(Range.isCollapsed(editor.selection));
  assert.deepEqual(editor.selection.anchor, point);
});

test('modified clicks and subsequent double clicks preserve the range', t => {
  const { editor, event } = setup(t);
  const previous = editor.selection;
  for (const modifier of [{ shiftKey: true }, { ctrlKey: true }, { metaKey: true },
    { altKey: true }, { detail: 2 }, { button: 2 }, { defaultPrevented: true }]) {
    selectOnEditorEntry(editor, { ...event, ...modifier });
    assert.equal(editor.selection, previous);
  }
});

test('focused editors and noneditable targets preserve selection', t => {
  const { editor, event } = setup(t);
  const previous = editor.selection;
  ReactEditor.isFocused.mock.mockImplementation(() => true);
  selectOnEditorEntry(editor, event);
  assert.equal(editor.selection, previous);
  ReactEditor.isFocused.mock.mockImplementation(() => false);
  ReactEditor.hasEditableTarget.mock.mockImplementation(() => false);
  selectOnEditorEntry(editor, event);
  assert.equal(editor.selection, previous);
});

test('unresolvable click positions leave native handling intact', t => {
  const { editor, event } = setup(t);
  const previous = editor.selection;
  ReactEditor.findEventRange.mock.mockImplementation(() => { throw new Error('No text point'); });
  assert.doesNotThrow(() => selectOnEditorEntry(editor, event));
  assert.equal(editor.selection, previous);
});
