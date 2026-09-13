import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSlateValue } from '../src/utils/normalizeSlateValue.js';
import normalizeResumeFromApi from '../src/utils/normalizeResumeFromApi.js';
import reducer, { addSection, addSubsection, addField } from '../src/store/resumeSlice.js';

const legacy = [{ children: [{ type: 'unordered-list', children: [{ children: [{ text: 'item', bold: true }] }] }] }];
const expected = [{ type: 'unordered-list', children: [{ type: 'list-item', children: [{ text: 'item', bold: true }] }] }];

test('bare wrappers are removed and untyped list text becomes an item without mutating input', () => {
  const before = structuredClone(legacy);
  assert.deepEqual(normalizeSlateValue(legacy), expected);
  assert.deepEqual(legacy, before);
  assert.deepEqual(normalizeSlateValue(expected), expected);
});

test('text and icons receive a paragraph wrapper and keep their marks', () => {
  const children = [{ text: 'a', italic: true }, { type: 'icon', iconId: 'phone', children: [{ text: '', fontSizeOffset: 2 }] }, { text: '' }];
  assert.deepEqual(normalizeSlateValue([{ children }]), [{ type: 'paragraph', children }]);
});

test('metadata-bearing wrappers are retained rather than losing their properties', () => {
  const value = [{ textAlign: 'right', custom: { id: 1 }, children: expected }];
  assert.deepEqual(normalizeSlateValue(value), value);
});

test('loading repairs both headings and fields', () => {
  const state = normalizeResumeFromApi({ columns: [{ id: 1, sections: [{ id: 2, columnId: 1, value: legacy,
    subsections: [{ id: 3, sectionId: 2, fields: [{ id: 4, subsectionId: 3, value: legacy }] }],
  }] }] });
  assert.deepEqual(state.sections.byId[2].value, expected);
  assert.deepEqual(state.fields.byId[4].value, expected);
});

test('incremental API additions repair only the incoming content', () => {
  let state = { ...reducer(undefined, { type: 'init' }), columns: { byId: { 1: { id: 1, sectionIds: [] } }, allIds: [1] } };
  state = reducer(state, addSection({ sectionData: { id: 2, columnId: 1, value: legacy, subsections: [
    { id: 3, sectionId: 2, fields: [{ id: 4, subsectionId: 3, value: legacy }] },
  ] } }));
  state = reducer(state, addSubsection({ subsectionData: { id: 5, sectionId: 2, fields: [{ id: 6, subsectionId: 5, value: legacy }] } }));
  state = reducer(state, addField({ fieldData: { id: 7, subsectionId: 5, value: legacy } }));
  assert.deepEqual(state.sections.byId[2].value, expected);
  for (const id of [4, 6, 7]) assert.deepEqual(state.fields.byId[id].value, expected);
});
