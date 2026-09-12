import assert from 'node:assert/strict';
import test from 'node:test';
import normalizeResumeFromApi from '../src/utils/normalizeResumeFromApi.js';
import reducer, { addSection } from '../src/store/resumeSlice.js';

const sections = [
  { id: 2, layout: { display: 'flex', grid: { columns: 3 }, padding: { top: '1rem' } } },
  { id: 3, layout: { display: 'grid', grid: { columns: 4 } } },
  { id: 4 },
];

test('loading converts legacy layouts, preserves grid columns, and does not mutate input', () => {
  const input = { columns: [{ id: 1, sections }] };
  const before = structuredClone(input);
  const state = normalizeResumeFromApi(input);
  assert.deepEqual(state.sections.byId[2].layout, {
    display: 'grid', grid: { columns: 1 }, padding: { top: '1rem' },
  });
  assert.equal(state.sections.byId[3].layout.grid.columns, 4);
  assert.deepEqual(state.sections.byId[4].layout, { display: 'grid', grid: { columns: 1 } });
  assert.deepEqual(input, before);
});

test('adding sections applies the same grid defaults', () => {
  let state = reducer(undefined, { type: 'init' });
  state = { ...state, columns: { byId: { 1: { id: 1, sectionIds: [] } }, allIds: [1] } };
  for (const section of sections) {
    state = reducer(state, addSection({ sectionData: { ...section, columnId: 1 } }));
  }
  assert.equal(state.sections.byId[2].layout.grid.columns, 1);
  assert.equal(state.sections.byId[3].layout.grid.columns, 4);
  assert.equal(state.sections.byId[4].layout.display, 'grid');
});
