import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { setResume } from '@/store/resumeSlice';
import { addSectionToApi } from '@/services/resumeServices';

import styles from './TopBar.module.css';

const AddSectionDropdown = ({ setAddSectionDropdownIsOpen }) => {

   // const initialized = useRef(false);

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);

   // useEffect(() => {
      // if (initialized.current) return;
      // initialized.current = true;
   // }, []);

   const sectionOptions = [
      { type: "header", label: "Header" },
      { type: "contact", label: "Contact" },
      { type: "workHistory", label: "Work History" },
      { type: "education", label: "Education" },
      { type: "skills", label: "Skills" },
      { type: "summary", label: "Summary" },
      { type: "projects", label: 'Projects' },
      { type: 'custom', label: 'Custom' }
   ];

   const handleAddSection = async (type) => {
      const updatedNormalizedResumeData = await addSectionToApi(resume.id, type);
      if (!updatedNormalizedResumeData) {
         return;
      }

      dispatch(setResume(updatedNormalizedResumeData));

      setAddSectionDropdownIsOpen(false);
   }
   // const handleAddSection = (type) => {
   //    let existingSectionId = null;
   //    sections.allIds.map((id) => {
   //       if (sections.byId[id].type === type) {
   //          existingSectionId = id;
   //       }
   //    })
   //    if (!existingSectionId) {
   //       dispatch(addSection(type));
   //    } else if (existingSectionId) {
   //       dispatch(addSubsection({ sectionId: existingSectionId }))
   //    }
   //    setAddSectionDropdownIsOpen(false);
   // }


   return (
      <div className={styles.dropdownContainer}>
         <div className={styles.dropdownMenuWrapper}>
            {sectionOptions.map((option) => (
               <div
                  key={option.type}
                  className={styles.dropdownOption}
                  onClick={() => handleAddSection(option.type)}
               >
                  {option.label}
               </div>
            ))}
         </div>
      </div>
   )
}

export default AddSectionDropdown;