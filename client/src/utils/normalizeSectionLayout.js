// Convert legacy layouts while preserving existing grid settings and padding.
export const normalizeSectionLayout = (layout = {}) => ({
  ...layout,
  display: 'grid',
  grid: {
    ...layout?.grid,
    columns: layout?.display === 'grid' ? layout.grid?.columns ?? 1 : 1,
  },
});
