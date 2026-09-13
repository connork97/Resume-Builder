import { Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const selectOnEditorEntry = (editor, event) => {
  // Only replace the saved range when clicking back into editable text.
  if (
    event.defaultPrevented || event.button !== 0 || event.detail > 1 ||
    event.shiftKey || event.ctrlKey || event.metaKey || event.altKey ||
    ReactEditor.isFocused(editor) ||
    !ReactEditor.hasEditableTarget(editor, event.target)
  ) return;

  let range;
  try {
    range = ReactEditor.findEventRange(editor, event);
  } catch {
    // Some padding/placeholder positions have no corresponding text point.
    return;
  }
  if (!range) return;

  Transforms.select(editor, Range.start(range));
  // Allow native focus, dragging, and subsequent clicks to proceed normally.
};
