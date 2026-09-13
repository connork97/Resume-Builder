import assert from 'node:assert/strict';
import test from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import undoable, { ActionCreators, excludeAction } from 'redux-undo';
import { createEditor, Editor, Node, Transforms } from 'slate';
import reducer, { updateFieldValue, updateSection, setActiveEditorSelection } from '../src/store/resumeSlice.js';
import { createSlateHistoryGrouping, observeHistoryOperations } from '../src/helpers/slateHelpers/historyGrouping.js';
import { withInlineVoidIcons } from '../src/helpers/slateHelpers/editorSchemaRules.js';
import { addListItem } from '../src/helpers/listBehavior.js';

const value = text => [{ type: 'paragraph', children: [{ text }] }];
const flush = async () => { await Promise.resolve(); };

async function setup(initial = '', { heading = false, nodes = value(initial) } = {}) {
  const base = reducer(undefined, { type: 'init' });
  const document = {
    ...base,
    id: 'resume',
    sections: { byId: { s1: { id: 's1', value: nodes, styling: {}, subsectionIds: ['sub1'] } }, allIds: ['s1'] },
    subsections: { byId: { sub1: { id: 'sub1', sectionId: 's1', fieldIds: ['f1'] } }, allIds: ['sub1'] },
    fields: { byId: { f1: { id: 'f1', subsectionId: 'sub1', value: nodes } }, allIds: ['f1'] },
  };
  const store = configureStore({
    reducer: {
      resume: undoable(reducer, {
        groupBy: action => action.meta?.historyGroup ?? null,
        filter: excludeAction([setActiveEditorSelection.type]),
      }),
    },
    preloadedState: { resume: { past: [], present: document, future: [] } },
  });
  let time = 0;
  const grouping = createSlateHistoryGrouping({ editorId: heading ? 's1' : 'f1', now: () => time });
  const editor = withInlineVoidIcons(createEditor());
  editor.children = structuredClone(nodes);
  observeHistoryOperations(editor, grouping);
  editor.onChange = () => {
    const historyGroup = grouping.getHistoryGroup(editor.operations, editor.selection, store.getState().resume.group, editor.marks);
    if (editor.operations.some(op => op.type !== 'set_selection')) {
      const action = heading
        ? updateSection({ id: 's1', changes: { value: editor.children } })
        : updateFieldValue({ fieldId: 'f1', newValue: editor.children });
      store.dispatch({ ...action, meta: { historyGroup } });
    }
    // The application's filtered toolbar update follows every content callback.
    store.dispatch(setActiveEditorSelection([...editor.children]));
  };
  Transforms.select(editor, Editor.end(editor, []));
  await flush();
  const history = () => store.getState().resume;
  const content = () => heading ? history().present.sections.byId.s1.value : history().present.fields.byId.f1.value;
  const plain = () => content().map(Node.string).join('\n');
  const type = async text => {
    for (const char of text) {
      time += 30;
      grouping.beforeInput('insertText');
      editor.insertText(char);
      await flush();
    }
  };
  return {
    editor, grouping, store, history, content, plain, type,
    pause: ms => { time += ms; },
    undo: () => store.dispatch(ActionCreators.undo()),
    redo: () => store.dispatch(ActionCreators.redo()),
  };
}

for (const heading of [false, true]) {
  test(`${heading ? 'headings' : 'fields'} group words with trailing spaces and redo whole words`, async () => {
    const h = await setup('', { heading });
    await h.type('hello world');
    assert.equal(h.history().past.length, 2);
    h.undo();
    assert.equal(h.plain(), 'hello ');
    h.undo();
    assert.equal(h.plain(), '');
    h.redo();
    h.redo();
    assert.equal(h.plain(), 'hello world');
  });
}

test('the first character is undoable immediately; blur retains an unfinished word', async () => {
  const h = await setup();
  await h.type('a');
  assert.equal(h.history().past.length, 1);
  await h.type('b');
  h.grouping.blur();
  assert.equal(h.history().past.length, 1);
  h.undo();
  assert.equal(h.plain(), '');
});

test('a pause starts another group without a timer or delayed dispatch', async () => {
  const h = await setup();
  await h.type('hel');
  h.pause(1000);
  await h.type('lo');
  assert.equal(h.history().past.length, 2);
  h.undo();
  assert.equal(h.plain(), 'hel');
});

test('automatic caret movement merges typing; deliberate selection changes split it', async () => {
  const h = await setup();
  await h.type('abcd');
  assert.equal(h.history().past.length, 1);
  Transforms.select(h.editor, { path: [0, 0], offset: 1 });
  await flush();
  await h.type('X');
  assert.equal(h.history().past.length, 2);
  h.undo();
  assert.equal(h.plain(), 'abcd');
});

test('blur/refocus and pointer boundaries split even when the caret returns to the same position', async () => {
  const h = await setup();
  await h.type('a');
  h.grouping.blur();
  await h.type('b');
  h.grouping.endHistoryGroup();
  await h.type('c');
  assert.equal(h.history().past.length, 3);
});

test('backspace groups across words, separates from insertion, and preserves forward-delete boundaries', async () => {
  const h = await setup('one two');
  await h.type('!');
  for (let i = 0; i < 5; i += 1) {
    h.grouping.beforeInput('deleteContentBackward');
    h.editor.deleteBackward('character');
    await flush();
  }
  assert.equal(h.history().past.length, 2);
  assert.equal(h.plain(), 'one');
  h.undo();
  assert.equal(h.plain(), 'one two!');
  h.undo();
  assert.equal(h.plain(), 'one two');

  const other = await setup('abcdef');
  Transforms.select(other.editor, { path: [0, 0], offset: 3 });
  await flush();
  other.grouping.beforeInput('deleteContentBackward');
  other.editor.deleteBackward('character');
  await flush();
  for (let i = 0; i < 2; i += 1) {
    other.grouping.beforeInput('deleteContentForward');
    other.editor.deleteForward('character');
    await flush();
  }
  assert.equal(other.history().past.length, 2);
  other.undo();
  assert.equal(other.plain(), 'abdef');
});

test('a deletion pause and word-delete each start a separate step', async () => {
  const h = await setup('one two three');
  h.grouping.beforeInput('deleteContentBackward');
  h.editor.deleteBackward('character');
  await flush();
  h.pause(1500);
  h.grouping.beforeInput('deleteContentBackward');
  h.editor.deleteBackward('character');
  await flush();
  h.grouping.beforeInput('deleteWordBackward');
  h.editor.deleteBackward('word');
  await flush();
  assert.equal(h.history().past.length, 3);
});

test('paste is one step even for a single character, with separate following typing', async () => {
  const h = await setup();
  await h.type('start');
  for (const inserted of [' pasted words', '!']) {
    h.grouping.isolatedInput();
    h.grouping.beforeInput('insertFromPaste');
    h.editor.insertText(inserted);
    await flush();
  }
  await h.type('end');
  assert.equal(h.history().past.length, 4);
  h.undo();
  h.undo();
  assert.equal(h.plain(), 'start pasted words');
  h.undo();
  assert.equal(h.plain(), 'start');
});

test('selected-text replacement keeps deletion and insertion in one step', async () => {
  const h = await setup('hello');
  Transforms.select(h.editor, {
    anchor: { path: [0, 0], offset: 1 }, focus: { path: [0, 0], offset: 4 },
  });
  await flush();
  await h.type('X');
  assert.equal(h.plain(), 'hXo');
  await h.type('Y');
  assert.equal(h.history().past.length, 2);
  h.undo();
  h.undo();
  assert.equal(h.plain(), 'hello');
});

test('cut removes a selection in one step', async () => {
  const h = await setup('hello world');
  Transforms.select(h.editor, {
    anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 6 },
  });
  await flush();
  h.grouping.isolatedInput();
  h.editor.deleteFragment();
  await flush();
  assert.equal(h.plain(), 'world');
  assert.equal(h.history().past.length, 1);
  h.undo();
  assert.equal(h.plain(), 'hello world');
});

test('Enter inside a list groups all custom split operations separately from typing', async () => {
  const h = await setup('', { nodes: [{
    type: 'unordered-list', children: [{ type: 'list-item', children: [{ text: 'first' }] }],
  }] });
  await h.type('!');
  const before = structuredClone(h.content());
  h.grouping.keyDown({ key: 'Enter' });
  addListItem(h.editor, Editor.above(h.editor, { match: n => n.type === 'list-item' }));
  await flush();
  await h.type('second');
  assert.equal(h.history().past.length, 3);
  h.undo();
  h.undo();
  assert.deepEqual(h.content(), before);
});

test('formatting and typing after it stay separate, including collapsed mark changes', async () => {
  const h = await setup('abc');
  await h.type('d');
  // Toolbar marking at a collapsed caret may emit onChange with no operations.
  h.editor.addMark('bold', true);
  await flush();
  await h.type('e');
  assert.equal(h.history().past.length, 2);
  h.undo();
  assert.equal(h.plain(), 'abcd');
});

test('an intervening document edit splits typing even when this editor remains focused', async () => {
  const h = await setup();
  await h.type('ab');
  h.store.dispatch(updateSection({ id: 's1', changes: { styling: { backgroundColor: 'red' } } }));
  await h.type('cd');
  assert.equal(h.history().past.length, 3);
  h.undo();
  assert.equal(h.plain(), 'ab');
  h.undo();
  assert.equal(h.history().present.sections.byId.s1.styling.backgroundColor, undefined);
  h.undo();
  assert.equal(h.plain(), '');
});

test('undo/redo and clearHistory break local groups even without a restored field value', async () => {
  const h = await setup();
  await h.type('a');
  h.undo();
  h.redo();
  await h.type('b');
  assert.equal(h.history().past.length, 2);
  h.store.dispatch(ActionCreators.clearHistory());
  await h.type('c');
  assert.equal(h.history().past.length, 1);
  h.undo();
  assert.equal(h.plain(), 'ab');
});

test('typing after undo clears redo and starts a new group', async () => {
  const h = await setup();
  await h.type('one two');
  h.undo();
  // Mirror the existing external-value synchronization, then re-enter the field.
  h.grouping.endHistoryGroup();
  h.editor.children = structuredClone(h.content());
  h.editor.selection = null;
  Transforms.select(h.editor, Editor.end(h.editor, []));
  await flush();
  await h.type('new');
  assert.equal(h.history().future.length, 0);
  h.undo();
  assert.equal(h.plain(), 'one ');
});

test('IME intermediate replacements and a delayed final commit share one step despite pauses', async () => {
  const h = await setup();
  h.grouping.compositionStart();
  h.grouping.beforeInput('insertCompositionText');
  h.editor.insertText('k');
  await flush();
  h.pause(3000);
  Transforms.select(h.editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 1 } });
  h.grouping.beforeInput('insertCompositionText');
  h.editor.insertText('か');
  await flush();
  h.grouping.compositionEnd();
  h.editor.insertText('な');
  await flush();
  assert.equal(h.history().past.length, 1);
  assert.equal(h.plain(), 'かな');
  await h.type('x');
  assert.equal(h.history().past.length, 2);
  h.undo();
  h.undo();
  assert.equal(h.plain(), '');
});

test('composition beforeinput fallback and blur commit retain one group', async () => {
  const h = await setup();
  h.grouping.beforeInput('insertCompositionText');
  h.editor.insertText('あ');
  await flush();
  h.grouping.blur();
  h.grouping.beforeInput('insertFromComposition');
  h.editor.insertText('い');
  await flush();
  assert.equal(h.history().past.length, 1);
  h.undo();
  assert.equal(h.plain(), '');
});

test('group IDs never collide between fields, headings or remounted controllers', () => {
  const point = { path: [0, 0], offset: 0 };
  const selection = { anchor: point, focus: point };
  const operation = { type: 'insert_text', path: [0, 0], offset: 0, text: 'a' };
  const ids = ['f1', 's1', 'f1'].map(editorId => {
    const grouping = createSlateHistoryGrouping({ editorId });
    grouping.observeOperation(operation, selection);
    return grouping.getHistoryGroup([operation], selection, null);
  });
  assert.equal(new Set(ids).size, ids.length);
});

test('switching between a field and a heading preserves global chronological order', async () => {
  const h = await setup();
  const heading = withInlineVoidIcons(createEditor());
  heading.children = value('');
  const grouping = createSlateHistoryGrouping({ editorId: 's1' });
  observeHistoryOperations(heading, grouping);
  heading.onChange = () => {
    const historyGroup = grouping.getHistoryGroup(heading.operations, heading.selection, h.history().group);
    if (heading.operations.some(op => op.type !== 'set_selection')) {
      h.store.dispatch({
        ...updateSection({ id: 's1', changes: { value: heading.children } }),
        meta: { historyGroup },
      });
    }
  };
  Transforms.select(heading, Editor.end(heading, []));
  await flush();
  await h.type('first');
  grouping.beforeInput('insertText');
  heading.insertText('heading');
  await flush();
  await h.type('second');
  assert.equal(h.history().past.length, 3);
  h.undo();
  assert.equal(h.plain(), 'first');
  h.undo();
  assert.equal(Node.string(h.history().present.sections.byId.s1.value[0]), '');
  h.undo();
  assert.equal(h.plain(), '');
});

test('selected-text formatting is its own step between typing groups', async () => {
  const h = await setup();
  await h.type('abc');
  Transforms.select(h.editor, {
    anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 3 },
  });
  await flush();
  h.grouping.keyDown({ key: 'b', ctrlKey: true });
  h.editor.addMark('bold', true);
  await flush();
  assert.equal(h.history().past.length, 2);
  h.undo();
  assert.deepEqual(h.content(), value('abc'));
  h.undo();
  assert.deepEqual(h.content(), value(''));
});

test('mobile paragraph input and multiline paste remain atomic', async () => {
  const h = await setup('first');
  h.grouping.beforeInput('insertParagraph');
  h.editor.insertBreak();
  await flush();
  h.grouping.beforeInput('insertFromPaste');
  h.editor.insertFragment([...value('second'), ...value('third')]);
  await flush();
  assert.equal(h.history().past.length, 2);
  h.undo();
  assert.equal(h.content().length, 2);
  h.undo();
  assert.deepEqual(h.content(), value('first'));
});
