import React, { useState, useEffect, useRef } from "react";

import styles from "../Toolbar.module.css";
import { addSectionToApi } from "@/services/resumeServices";

const AddSection = () => {
  const [addSectionDropdownIsOpen, setAddSectionDropdownIsOpen] =
    useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAddSectionDropdownIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// ! DROPDOWN JAVASCRIPT ! //

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
  return (
    <div ref={dropdownRef}>
      <button
        className="buttonMain"
        onClick={() => setAddSectionDropdownIsOpen(!addSectionDropdownIsOpen)}
      >
        + Add Section
      </button>
      {addSectionDropdownIsOpen && (
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
      )}
    </div>
  );
};

export default AddSection;
