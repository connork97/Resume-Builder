import React, { useState, useEffect, useRef } from 'react';
import styles from "./Toolbar.module.css";

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";

const AddSection = () => {
   const resumeStyling = useSelector((state) => state.resume.styling);
   const sections = useSelector((state) => state.resume.sections);

   const dispatch = useDispatch();
   const [open, setOpen] = useState(false);
   const dropdownRef = useRef(null);
   const initialized = useRef(false);
   // Function to add each section type, as well as default/dummy data for each section upon page load.  Just use lorem ipsum text, with each word filling in each subsection field

   const addDefaultSections = () => {
      if (sections.length > 0) return; // Prevent adding sections if already present

      const resumeSampleDataArr = ["Connor", "Kormos", "test@email.com", "(123)456-7890", "Los Angeles, CA", "www.mywebsite.com", "test.linked.in", "Job Title", "Company", "Los Angeles", "Jan 2026 - Present", "Job description", "UCLA", "Bachelor of Science", "Software Engineering", "Los Angeles, CA", "Jan 2020 - Dec 2020", "School description", "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Summary text/description"];
      let wordIndex = 0;
      const getNextWord = () => resumeSampleDataArr[wordIndex++ % resumeSampleDataArr.length];

      sectionOptions.forEach((option) => {
         const action = addSection(option.type);
         const data = action.payload;

         data.subsections.forEach(sub => {
            sub.fields.forEach(field => {
               field.value = [
                  {
                     type: "paragraph",
                     label: field.label,
                     children: [
                        {
                           text: getNextWord(),
                           // fontSize: resumeStyling.fontSize,
                           // lineHeight: resumeStyling.lineHeight
                        }
                     ]
                  }
               ];
            });
         });

         handleAddOrAppend(option.type, {}, data);
      });
   };
   useEffect(() => {
      if (initialized.current) return;
      initialized.current = true;
      addDefaultSections();
   }, [])
   // End default/dummy data function
   const sectionOptions = [
      { type: "header", label: "Header" },
      { type: "contact", label: "Contact" },
      { type: "workHistory", label: "Work History" },
      { type: "education", label: "Education" },
      { type: "skills", label: "Skills" },
      { type: "summary", label: "Summary" }
   ];

   // Add a section OR append a subsection if it already exists
   const handleAddOrAppend = (type, subsectionData = {}, sectionData = null) => {
      const existing = sections.find((s) => s.type === type);

      if (!existing) {
         if (sectionData) {
            const action = addSection(type);
            action.payload = sectionData;
            dispatch(action);
         } else {
            dispatch(addSection(type));
         }
      } else {
         dispatch(
            addSubsection({
               sectionId: existing.id,
               subsectionData: subsectionData
            })
         );
      }

      setOpen(false); // close dropdown after selection
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <div className={styles.addSectionWrapperDiv} ref={dropdownRef}>
         <button
            className={styles.addSectionButton}
            onClick={() => setOpen((prev) => !prev)}
         >
            + Add Section
         </button>
         {open && (
            <div className={styles.dropdownMenu}>
               {sectionOptions.map((option) => (
                  <div
                     key={option.type}
                     className={styles.dropdownItem}
                     onClick={() => handleAddOrAppend(option.type)}
                  >
                     {option.label}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default AddSection;