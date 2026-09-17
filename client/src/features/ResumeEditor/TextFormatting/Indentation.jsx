import { useDispatch, useSelector } from 'react-redux';

import { updateField, updateSection } from "@/store/resumeSlice";
import { BiRightIndent, BiLeftIndent } from 'react-icons/bi';

export default function Indentation() {

   const dispatch = useDispatch();

   const activeEditorId = useSelector((state) => state.resume.present.activeEditorId);
   const reduxFields = useSelector((state) => state.resume.present.fields);
   const activeField= reduxFields?.byId[activeEditorId];
   const activeSectionId = useSelector((state) => state.resume.present.activeSectionIds[0]);
   const reduxSections = useSelector((state) => state.resume.present.sections);

   const handleFieldIndentationChange = (indentOrOutdent) => {
      if (!activeEditorId) return;
      const isSectionHeading = activeEditorId == activeSectionId;
      let activeTarget = activeField;
      if (isSectionHeading) {
         activeTarget = reduxSections?.byId[activeSectionId];
      }
      let currentMarginLeft = parseFloat(activeTarget.layout?.marginLeft || 0);
      const indentationStep = 0.25;

      if (indentOrOutdent === "indent") {
         currentMarginLeft += indentationStep;
      } else if (indentOrOutdent === "outdent") {
         currentMarginLeft -= indentationStep;
      }

      if (isSectionHeading) {
         dispatch(updateSection({
            id: activeTarget.id,
            changes: {
               layout: {
                  marginLeft: `${currentMarginLeft}rem`,
               },
            },
         }));
      } else if (!isSectionHeading) {
         dispatch(updateField({
            id: activeTarget.id,
            changes: {
               layout: {
                  marginLeft: `${currentMarginLeft}rem`,
               },
            },
         }));
      }
   }

  return (
    <>
      <button className="buttonMain" onClick={() => handleFieldIndentationChange("indent")}><BiRightIndent style={{position: 'relative', top: '0.1em'}} /></button>
      <button className="buttonMain" onClick={() => handleFieldIndentationChange("outdent")}><BiLeftIndent style={{position: 'relative', top: '0.1em'}} /></button>
    </>
  );
}
