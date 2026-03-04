

import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";

import './Sections.css';

import AutoWidthInput from "../AutoWidthInput.jsx";

// import Header from "../Sections/Header";
// import Contact from "../Sections/Contact";
// import WorkHistory from "../Sections/WorkHistory";
// import Education from "../Sections/Education";
// import Skills from "../Sections/Skills";
// import Summary from "../Sections/Summary";

const SectionWrapper = ({ id, type, data }) => {

  const dispatch = useDispatch();

  const handleFieldChange = (subId, fieldId, value) => {
    dispatch(
      updateField({
        sectionId: id,
        subsectionId: subId,
        fieldId,
        newValue: value
      })
    );
  };

  // // SLATE IMPLEMENTATION STARTS HERE

  // const [editor] = useState(() => withReact(createEditor()));

  // const initialValue = [
  //   {
  //     type: 'paragraph',
  //     children: [{ text: 'A line of text in a paragraph.' }],
  //   },
  // ]

  // const renderElement = useCallback(props => {
  //   switch (props.element.type) {
  //     default:
  //       return <DefaultElement {...props} />
  //   }
  // }, [])

  // if (editor) return (
  //   <Slate
  //     editor={editor}
  //     initialValue={initialValue}
  //   >
  //     <Editable
  //       renderElement={renderElement}
  //     />
  //   </Slate>
  // )

  return (

    <div className="sectionContainerDiv">
      {/* Section Title */}
      <div className="sectionTitle" style={{...data.styling}}>{data.sectionTitle}</div>

      {/* Render All Subsections */}
      {data.subsections?.map((sub) => (
        <div key={sub.id} className="subsectionWrapperDiv" style={{...sub.styling}}>
          {sub.fields?.map((field) => {
            const isDescription = field.key === "description";
            console.log(sub.styling)
            // DESCRIPTION → textarea (not auto-width)
            if (isDescription) {
              return (
                <textarea
                key={field.id}
                className="sectionTextArea"
                placeholder={field.label}
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(sub.id, field.id, e.target.value)
                }
                />
              );
            }

            // DEFAULT FIELD → AutoWidthInput
            return (
              <AutoWidthInput
                key={field.id}
                className="sectionInput"
                value={field.value}
                placeholder={field.label}
                styling={field.styling}
                onChange={(value) =>
                  handleFieldChange(sub.id, field.id, value)
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  )
}

export default SectionWrapper;