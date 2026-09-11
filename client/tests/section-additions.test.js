import assert from 'node:assert/strict';
import test from 'node:test';
import reducer, { addSection, addSubsection, updateFieldValue } from '../src/store/resumeSlice.js';

const value = text => [{ type: 'paragraph', children: [{ text }] }];
const field = (id, subsectionId, position = 0) => ({
  id, subsectionId, position, value: value(''), styling: {}, layout: {},
});
const initialResume = () => ({
  ...reducer(undefined, { type: 'init' }),
  title: 'Unsaved title',
  columns: { byId: { 1: { id: 1, sectionIds: [2] } }, allIds: [1] },
  sections: { byId: { 2: { id: 2, columnId: 1, subsectionIds: [3], value: value('Unsaved heading'), styling: { color: 'red' } } }, allIds: [2] },
  subsections: { byId: { 3: { id: 3, sectionId: 2, fieldIds: [4] } }, allIds: [3] },
  fields: { byId: { 4: { ...field(4, 3), value: value('Unsaved text') } }, allIds: [4] },
});

test('new sections register ordered descendants and preserve existing edits across additions', () => {
  const before = initialResume();
  let state = reducer(before, addSection({ sectionData: {
    id: 5, columnId: 1, value: value('Projects'), styling: {}, layout: {},
    subsections: [
      { id: 8, sectionId: 5, position: 1, fields: [] },
      { id: 6, sectionId: 5, position: 0, fields: [field(9, 6, 1), field(7, 6, 0)] },
    ],
  } }));
  assert.deepEqual(state.columns.byId[1].sectionIds, [2, 5]);
  assert.deepEqual(state.sections.byId[5].subsectionIds, [6, 8]);
  assert.deepEqual(state.subsections.byId[6].fieldIds, [7, 9]);
  assert.deepEqual(state.subsections.byId[8].fieldIds, []);
  assert.deepEqual(state.fields.byId[7], field(7, 6));
  assert.equal(state.sections.byId[5].subsections, undefined);
  assert.equal(state.subsections.byId[6].fields, undefined);
  state = reducer(state, updateFieldValue({ fieldId: 7, newValue: value('New project text') }));
  state = reducer(state, addSection({ sectionData: { id: 10, columnId: 1, subsections: [] } }));
  const saved = JSON.parse(JSON.stringify(state));
  assert.deepEqual(saved.fields.byId[7].value, value('New project text'));
  assert.deepEqual(saved.sections.byId[2], before.sections.byId[2]);
  assert.deepEqual(saved.fields.byId[4], before.fields.byId[4]);
  assert.equal(saved.title, before.title);
});

test('existing-section response appends only the new subsection and fields', () => {
  const before = initialResume();
  const state = reducer(before, addSubsection({ subsectionData: {
    id: 5, sectionId: 2, position: 1, fields: [field(6, 5)],
  } }));
  assert.deepEqual(state.sections.allIds, [2]);
  assert.deepEqual(state.sections.byId[2], { ...before.sections.byId[2], subsectionIds: [3, 5] });
  assert.deepEqual(state.subsections.byId[5].fieldIds, [6]);
  assert.deepEqual(state.fields.allIds, [4, 6]);
  assert.deepEqual(state.fields.byId[6], field(6, 5));
  assert.deepEqual(state.fields.byId[4], before.fields.byId[4]);
});
