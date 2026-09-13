export default function useFocusSlateEditor(editableRef) {
   console.log("Focusing editable:", editableRef.current);
  return () => {
    if (editableRef && editableRef.current) {
      editableRef.current.focus();
    }
  };
}