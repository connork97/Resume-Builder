import React, { useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import DefaultElement from "./DefaultElement";
import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";

const SlateField = ({ field, sectionId, subsectionId }) => {
   
  const dispatch = useDispatch();
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    return <DefaultElement {...props} />;
  }, []);

  const handleUpdateField = (newValue) => {
      dispatch(
         updateField({
            sectionId,
            subsectionId,
            fieldId: field.id,
            newValue,
         })
      )
  }

  return (
    <Slate
      editor={editor}
      initialValue={field.value}
      value={field.value}
      onChange={(newValue) =>
         handleUpdateField(newValue)
      }
    >
      <Editable renderElement={renderElement} placeholder={field.label} />
    </Slate>
  );
}

export default SlateField;