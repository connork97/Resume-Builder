import React from 'react';

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";

import styles from './Toolbar.module.css';

const AddSectionDropdown = ({ setAddSectionDropdownIsOpen }) => {

   const dispatch = useDispatch();

   const sections = useSelector((state) => state.resume.sections);

   const sectionOptions = [
      { type: "header", label: "Header" },
      { type: "contact", label: "Contact" },
      { type: "workHistory", label: "Work History" },
      { type: "education", label: "Education" },
      { type: "skills", label: "Skills" },
      { type: "summary", label: "Summary" }
   ];

   const handleAddSection = (type) => {
      let existingSectionId = null;
      sections.allIds.map((id) => {
         if (sections.byId[id].type === type) {
            existingSectionId = id;
         }
      })
      if (!existingSectionId) {
         dispatch(addSection(type));
      } else if (existingSectionId) {
         dispatch(addSubsection({ sectionId: existingSectionId }))
      }
      setAddSectionDropdownIsOpen(false);
   }

   return (
      <div className={styles.dropdownMenu}>
         {sectionOptions.map((option) => (
            <div
               key={option.type}
               className={styles.dropdownItem}
               onClick={() => handleAddSection(option.type)}
            >
               {option.label}
            </div>
         ))}
      </div>
   )
}

export default AddSectionDropdown;







   // const initialized = useRef(false);

// Function to add each section type, as well as default/dummy data for each section upon page load.  Just use lorem ipsum text, with each word filling in each subsection field

// const addDefaultSections = () => {
//    if (sections.length > 0) return; // Prevent adding sections if already present

//    const resumeSampleDataArr = ["Connor", "Kormos", "test@email.com", "(123)456-7890", "Los Angeles, CA", "www.mywebsite.com", "test.linked.in", "Job Title", "Company", "Los Angeles", "Jan 2026 - Present", "Job description", "UCLA", "Bachelor of Science", "Software Engineering", "Los Angeles, CA", "Jan 2020 - Dec 2020", "School description", "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Summary text/description"];
//    let wordIndex = 0;
//    const getNextWord = () => resumeSampleDataArr[wordIndex++ % resumeSampleDataArr.length];

//    sectionOptions.forEach((option) => {
//       const action = addSection(option.type);
//       const data = action.payload;
//       // console.log('DEFAULT DATA: ', data.subsection)
//       const subsection = data.subsection;
//       const section = data.section;
//       // console.log(data)
//       // console.log(subsections)
//       // data.subsections.forEach(sub => {
//       //    sub.fields.forEach(field => {
//       //       field.value = [
//       //          {
//       //             type: "paragraph",
//       //             label: field.label,
//       //             children: [
//       //                {
//       //                   text: getNextWord(),
//       //                }
//       //             ]
//       //          }
//       //       ];
//       //    });
//       // });

//       // console.log('DATA: ', data.subsection, data.section)
//       handleAddOrAppend(option.type, data.subsection, data.section);
//    });
// };
// useEffect(() => {
// if (initialized.current) return;
// initialized.current = true;
// addDefaultSections();
// }, [])
// End default/dummy data function