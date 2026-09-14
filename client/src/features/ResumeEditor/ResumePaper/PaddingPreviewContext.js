import { createContext } from 'react';

export const PaddingPreviewContext = createContext(null);

export function previewLayout(layout, preview, target, id) {
  if (!preview || preview.target !== target || preview.id !== id) return layout;
  return {
    ...layout,
    padding: { ...layout?.padding, [preview.side]: `${preview.value}rem` },
  };
}
