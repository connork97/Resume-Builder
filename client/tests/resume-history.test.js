import assert from 'node:assert/strict';
import test from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import reducer, * as actions from '../src/store/resumeSliceWithHistory.js';

const value = text => [{ type: 'paragraph', children: [{ text }] }];
const fixture = () => ({
   id: 'resume-1', userId: 'user-1', title: 'Original',
   columns: {
      byId: {
         c1: { id: 'c1', sectionIds: ['s1', 's2'], layout: { width: { auto: true, value: '50%' } } },
         c2: { id: 'c2', sectionIds: [], layout: { width: { auto: true, value: '50%' } } },
      }, allIds: ['c1', 'c2'],
   },
   sections: {
      byId: {
         s1: { id: 's1', columnId: 'c1', position: 0, subsectionIds: ['sub1'], value: value('Heading'), styling: { backgroundColor: 'white' }, layout: {} },
         s2: { id: 's2', columnId: 'c1', position: 1, subsectionIds: [], value: value('Second heading'), styling: {}, layout: {} },
      }, allIds: ['s1', 's2'],
   },
   subsections: {
      byId: { sub1: { id: 'sub1', sectionId: 's1', fieldIds: ['f1', 'f2'] } }, allIds: ['sub1'],
   },
   fields: {
      byId: {
         f1: { id: 'f1', subsectionId: 'sub1', position: 0, value: value('Original text') },
         f2: { id: 'f2', subsectionId: 'sub1', position: 1, value: value('Unrelated content '.repeat(100)) },
      }, allIds: ['f1', 'f2'],
   },
});
const start = () => reducer(undefined, actions.loadResume(fixture()));
const document = state => actions.selectResumeDocument({ resume: state });
const title = text => actions.updateResume({ key: 'title', changes: text });
const color = backgroundColor => actions.updateSection({ id: 's1', changes: { styling: { backgroundColor } } });
const text = newText => actions.updateFieldValue({ fieldId: 'f1', newValue: value(newText) });
const undo = state => reducer(state, actions.undoResume());
const redo = state => reducer(state, actions.redoResume());
const grouped = (action, group = 'gesture-1', extra = {}) => actions.withResumeHistory(action, { group, ...extra });

test('text, color, and cross-column reorder share one chronological timeline', () => {
   const original = start();
   const typed = reducer(original, text('Edited text'));
   const colored = reducer(typed, color('red'));
   const reordered = reducer(colored, actions.dndReorderSections({ dndKitDict: { c1: ['s2'], c2: ['s1'] } }));
   assert.equal(reordered.history.past.length, 3);
   assert.equal(reordered.sections.byId.s1.columnId, 'c2');
   assert.deepEqual(document(undo(reordered)), document(colored));
   assert.deepEqual(document(undo(undo(reordered))), document(typed));
   const undone = undo(undo(undo(reordered)));
   assert.deepEqual(document(undone), document(original));
   assert.deepEqual(document(redo(redo(redo(undone)))), document(reordered));
   assert.deepEqual(document(original), document(start()), 'prior Redux states remain immutable');
});

test('history stores changed leaves and never includes nested history or unchanged content', () => {
   const before = start();
   const after = reducer(before, color('red'));
   assert.deepEqual(after.history.past[0].patches, [{
      op: 'replace', path: ['sections', 'byId', 's1', 'styling', 'backgroundColor'], value: 'red',
   }]);
   assert.deepEqual(after.history.past[0].inversePatches, [{
      op: 'replace', path: ['sections', 'byId', 's1', 'styling', 'backgroundColor'], value: 'white',
   }]);
   assert.equal(after.fields, before.fields);
   assert.equal(undo(after).fields, before.fields);
   const serialized = JSON.stringify(after.history);
   assert.equal(serialized.includes('Unrelated content'), false);
   assert.equal(serialized.includes('actionStack'), false);
   assert.equal(serialized.includes('"history"'), false);
});

test('Slate value replacement is reduced to its changed text leaf', () => {
   const state = reducer(start(), text('New text'));
   assert.deepEqual(state.history.past[0].patches, [{
      op: 'replace', path: ['fields', 'byId', 'f1', 'value', 0, 'children', 0, 'text'], value: 'New text',
   }]);
});

test('new edits invalidate redo; selection updates, unknown actions, and semantic no-ops do not', () => {
   let state = undo(reducer(start(), color('red')));
   const future = state.history.future;
   state = reducer(state, actions.setActiveEditorId('f1'));
   state = reducer(state, actions.setActiveEditorSelection(value('selection data')));
   state = reducer(state, color('white'));
   state = reducer(state, text('Original text'));
   state = reducer(state, { type: 'user/login' });
   assert.equal(state.history.future, future);
   assert.equal(state.history.past.length, 0);
   state = reducer(state, title('A new branch'));
   assert.equal(state.history.future.length, 0);
   assert.equal(redo(state), state);
});

test('a continuous gesture stores its net change, not all intermediate values', () => {
   let state = start();
   for (let index = 0; index < 500; index += 1) {
      state = reducer(state, grouped(color(`color-${index}`)));
   }
   assert.equal(state.history.past.length, 1);
   assert.equal(state.history.past[0].patches.length, 1);
   assert.equal(state.history.past[0].inversePatches[0].value, 'white');
   assert.equal(state.history.past[0].patches[0].value, 'color-499');
   assert.equal(undo(state).sections.byId.s1.styling.backgroundColor, 'white');
   assert.equal(redo(undo(state)).sections.byId.s1.styling.backgroundColor, 'color-499');
});

test('returning to the start of a gesture removes its undo entry', () => {
   let state = reducer(start(), title('Earlier edit'));
   state = reducer(state, grouped(color('red')));
   state = reducer(state, grouped(color('white')));
   assert.equal(state.history.past.length, 1);
   assert.equal(state.history.group, null);
   assert.equal(undo(state).title, 'Original');
});

test('intervening edits, explicit boundaries, focus changes, and undo/redo prevent merging', () => {
   let state = reducer(start(), grouped(text('One')));
   state = reducer(state, color('red'));
   state = reducer(state, grouped(text('Two')));
   assert.equal(state.history.past.length, 3);
   state = reducer(state, actions.closeResumeHistoryGroup());
   state = reducer(state, grouped(text('Three')));
   state = reducer(state, actions.setActiveEditorId('f2'));
   state = reducer(state, grouped(text('Four')));
   assert.equal(state.history.past.length, 5);
   state = redo(undo(state));
   state = reducer(state, grouped(text('Five')));
   assert.equal(state.history.past.length, 6);
});

test('multiple reducers can form one atomic transaction, including newly created targets', () => {
   const before = start();
   const after = reducer(before, actions.resumeTransaction([
      actions.addField({ fieldData: { id: 'f3', subsectionId: 'sub1', value: value(''), position: 2 } }),
      actions.updateFieldValue({ fieldId: 'f3', newValue: value('New entry') }),
      color('blue'),
   ], { label: 'Add and format an entry' }));
   assert.equal(after.history.past.length, 1);
   assert.equal(after.history.past[0].label, 'Add and format an entry');
   assert.deepEqual(after.fields.byId.f3.value, value('New entry'));
   assert.deepEqual(document(undo(after)), document(before));
   assert.deepEqual(document(redo(undo(after))), document(after));
});

test('a transaction with no net change adds no history and preserves redo', () => {
   const before = undo(reducer(start(), color('red')));
   const after = reducer(before, actions.resumeTransaction([color('blue'), color('white')]));
   assert.equal(after.history, before.history);
   assert.deepEqual(document(after), document(before));
});

test('invalid transaction members are rejected before mutation', () => {
   const before = start();
   for (const invalid of [actions.undoResume(), actions.loadResume(fixture()), actions.setResumeId('other'),
      { type: 'user/login' }, grouped(color('red')), null]) {
      assert.throws(() => reducer(before, actions.resumeTransaction([title('Bad'), invalid])), TypeError);
   }
   assert.equal(before.title, 'Original');
   assert.equal(before.history.past.length, 0);
});

test('deleting and restoring a section restores its complete normalized subtree', () => {
   let before = reducer(start(), actions.setActiveSectionId('s1'));
   before = reducer(before, actions.setActiveEditorId('f1'));
   const after = reducer(before, actions.deleteSection('s1'));
   assert.equal(after.fields.byId.f1, undefined);
   assert.equal(after.fields.byId.f2, undefined);
   assert.equal(after.subsections.byId.sub1, undefined);
   assert.deepEqual(after.activeSectionIds, []);
   assert.equal(after.activeEditorId, null);
   assert.deepEqual(document(undo(after)), document(before));
   assert.deepEqual(document(redo(undo(after))), document(after));
});

test('grouped structural edits compose inverse patches in the right order', () => {
   const before = start();
   let state = reducer(before, grouped(actions.deleteField('f1')));
   state = reducer(state, grouped(actions.deleteField('f2')));
   state = reducer(state, grouped(actions.addField({ fieldData: {
      id: 'f3', subsectionId: 'sub1', position: 0, value: value('Replacement'),
   } })));
   assert.equal(state.history.past.length, 1);
   assert.deepEqual(document(undo(state)), document(before));
   assert.deepEqual(document(redo(undo(state))), document(state));
});

test('array growth, shrinking, reorder, object-key removal, and type changes round trip', () => {
   const values = [
      [1, 2, 3, 4], [4, 2], [4, { bold: true, text: 'a' }, [1, 2]],
      [4, { text: 'b' }, []], [], { nodes: [1], temporary: true }, { nodes: [2, 3] },
      null, 'a string', { deeply: { nested: [false, { text: 'end' }] } },
   ];
   let state = start();
   for (const sample of values) {
      const before = state;
      state = reducer(state, actions.updateResume({ key: 'styling', changes: { testData: sample } }));
      assert.deepEqual(document(undo(state)), document(before));
      assert.deepEqual(document(redo(undo(state))), document(state));
   }
});

test('history has a configurable limit, including disabling retention', () => {
   let state = reducer(start(), actions.setResumeHistoryLimit(3));
   for (let index = 1; index <= 10; index += 1) state = reducer(state, title(`Title ${index}`));
   assert.equal(state.history.past.length, 3);
   state = undo(undo(undo(state)));
   assert.equal(state.title, 'Title 7');
   assert.equal(undo(state), state);
   state = reducer(state, actions.setResumeHistoryLimit(1));
   assert.equal(redo(state).title, 'Title 8', 'retain the next redo, not the most distant redo');
   state = reducer(state, actions.setResumeHistoryLimit(0));
   state = reducer(state, title('Not retained'));
   assert.equal(state.history.past.length, 0);
   assert.equal(state.history.future.length, 0);
   for (const invalid of [-1, 1.5, Infinity, '10']) {
      assert.throws(() => reducer(state, actions.setResumeHistoryLimit(invalid)), TypeError);
   }
});

test('recording many independent edits grows linearly without copying earlier history', () => {
   let state = reducer(start(), actions.setResumeHistoryLimit(200));
   for (let index = 0; index < 50; index += 1) state = reducer(state, title(`Title ${index}`));
   const firstSize = JSON.stringify(state.history).length;
   for (let index = 50; index < 100; index += 1) state = reducer(state, title(`Title ${index}`));
   assert.equal(state.history.past.length, 100);
   assert.ok(JSON.stringify(state.history).length < firstSize * 2.1);
});

test('load and identity changes reset history and ignore persisted history/UI', () => {
   let state = reducer(start(), actions.setResumeHistoryLimit(12));
   state = reducer(state, title('Local edit'));
   const loaded = reducer(state, actions.setResume({
      ...fixture(), id: 'resume-2', actionStack: [{ title: 'stale' }],
      history: state.history, activeSectionIds: ['missing'], activeEditorId: 'missing',
   }));
   assert.equal(loaded.history.past.length, 0);
   assert.equal(loaded.history.limit, 12);
   assert.equal(loaded.history.restorationVersion, state.history.restorationVersion + 1);
   assert.equal(loaded.actionStack, undefined);
   assert.deepEqual(loaded.activeSectionIds, []);
   assert.equal(loaded.activeEditorId, null);
   const identified = reducer(state, actions.setResumeId('resume-3'));
   assert.equal(identified.history.past.length, 0);
   assert.equal(reducer(state, actions.setResumeId('resume-1')).history, state.history);
});

test('external document edits establish a fresh base rather than retaining stale patches', () => {
   const before = undo(reducer(reducer(start(), text('Local')), color('red')));
   const after = reducer(before, actions.withResumeHistory(text('Server'), { mode: 'reset' }));
   assert.equal(after.history.past.length, 0);
   assert.equal(after.history.future.length, 0);
   assert.equal(after.history.restoration.kind, 'external');
   const edited = reducer(after, color('blue'));
   assert.deepEqual(document(undo(edited)), document(after));
   assert.throws(() => reducer(after, actions.withResumeHistory(color('red'), { mode: 'skip' })), TypeError);
});

test('undo preserves UI choices and refs, with a separate Slate restoration signal', () => {
   const selectionBefore = { editorId: 'f1', selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } } };
   const selectionAfter = { editorId: 'f1', selection: { anchor: { path: [0, 0], offset: 3 }, focus: { path: [0, 0], offset: 3 } } };
   let state = reducer(start(), grouped(text('One'), 'typing', { selectionBefore, selectionAfter }));
   state = reducer(state, grouped(text('Two'), 'typing', { selectionBefore: selectionAfter, selectionAfter }));
   state = reducer(state, actions.setActiveSectionId('s2'));
   const ref = { current: 'mock-print-target' };
   state = reducer(state, actions.setResumePrintRef(ref));
   const undone = undo(state);
   assert.deepEqual(undone.activeSectionIds, ['s2']);
   assert.equal(undone.ref, ref);
   assert.equal(undone.history.restorationVersion, state.history.restorationVersion + 1);
   assert.deepEqual(undone.history.restoration, { kind: 'undo', selection: selectionBefore });
   assert.deepEqual(redo(undone).history.restoration, { kind: 'redo', selection: selectionAfter });
});

test('selectors, legacy undo action, and history clearing work with a real Redux store', () => {
   const store = configureStore({ reducer: { resume: reducer } });
   store.dispatch(actions.loadResume(fixture()));
   store.dispatch(actions.withResumeHistory(color('red'), { label: 'Change background' }));
   assert.equal(actions.selectCanUndoResume(store.getState()), true);
   assert.equal(actions.selectResumeUndoLabel(store.getState()), 'Change background');
   store.dispatch(actions.revertToPreviousState());
   assert.equal(actions.selectCanRedoResume(store.getState()), true);
   assert.equal(actions.selectResumeRedoLabel(store.getState()), 'Change background');
   const persisted = actions.selectResumeDocument(store.getState());
   assert.equal(persisted.history, undefined);
   assert.equal(persisted.activeEditorId, undefined);
   assert.equal(persisted.id, 'resume-1');
   store.dispatch(actions.clearResumeHistory());
   assert.equal(actions.selectCanRedoResume(store.getState()), false);
   assert.deepEqual(actions.selectResumeDocument(store.getState()), persisted);
});

test('generic updates cannot overwrite the history bookkeeping', () => {
   const state = start();
   for (const key of ['history', 'actionStack', 'id', 'activeEditorId']) {
      assert.throws(() => reducer(state, actions.updateResume({ key, changes: {} })), TypeError);
   }
});

test('document-only Redux preloading starts clean and ignores old snapshot history', () => {
   const store = configureStore({
      reducer: { resume: reducer },
      preloadedState: { resume: { ...fixture(), actionStack: [{ title: 'old' }] } },
   });
   assert.equal(store.getState().resume.actionStack, undefined);
   store.dispatch(title('New edit'));
   store.dispatch(actions.undoResume());
   assert.equal(store.getState().resume.title, 'Original');
});

test('history metadata belonging to another slice is ignored', () => {
   const state = start();
   assert.equal(reducer(state, { type: 'user/login', meta: { history: { mode: 'unrelated' } } }), state);
});

test('lowering the limit caps combined undo and redo retention', () => {
   let state = start();
   for (let index = 0; index < 10; index += 1) state = reducer(state, title(`Title ${index}`));
   state = undo(undo(undo(undo(state))));
   state = reducer(state, actions.setResumeHistoryLimit(8));
   assert.equal(state.history.past.length + state.history.future.length, 8);
   state = redo(redo(state));
   assert.equal(state.title, 'Title 7');
   assert.equal(state.history.past.length, 8);
   assert.equal(state.history.future.length, 0);
});

test('deterministic nested JSON edits survive serialized patch replay and repeated grouping', () => {
   let seed = 13579;
   const random = max => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % max;
   };
   const sample = depth => {
      const kind = random(depth > 0 ? 5 : 3);
      if (kind === 0) return null;
      if (kind === 1) return random(100);
      if (kind === 2) return `text-${random(100)}`;
      if (kind === 3) return Array.from({ length: random(5) }, () => sample(depth - 1));
      return Object.fromEntries(Array.from({ length: random(5) }, (_, index) => [`key${index}`, sample(depth - 1)]));
   };
   let state = start();
   for (let index = 0; index < 100; index += 1) {
      const before = document(state);
      const group = `sample-${index}`;
      state = reducer(state, grouped(actions.updateResume({ key: 'styling', changes: { generated: sample(3) } }), group));
      state = reducer(state, grouped(actions.updateResume({ key: 'styling', changes: { generated: sample(3) } }), group));
      // Equivalent values can produce a net-zero group: nothing to round-trip.
      if (state.history.group !== group) continue;
      const after = document(state);
      const serializedState = JSON.parse(JSON.stringify(state));
      assert.deepEqual(document(undo(serializedState)), before);
      assert.deepEqual(document(redo(undo(serializedState))), after);
   }
});
