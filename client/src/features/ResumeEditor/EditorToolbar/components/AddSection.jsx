import React, { useState, useEffect, useRef } from "react";

import styles from "../Toolbar.module.css";
import { addSectionToApi } from "@/services/resumeServices";
import TextFormatDropdown from "../../TextFormatting/shared/TextFormatDropdown";
import { useDispatch, useSelector } from "react-redux";
import { setResume } from "@/store/resumeSlice";

const AddSection = () => {
  const dispatch = useDispatch();
  const resume = useSelector(state => state.resume)

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
    { type: "projects", label: "Projects" },
    { type: "custom", label: "Custom" },
  ];

  const handleAddSection = async (type) => {
    const updatedNormalizedResumeData = await addSectionToApi(resume.id, type);
    if (!updatedNormalizedResumeData) {
      return;
    }

    dispatch(setResume(updatedNormalizedResumeData));

    setAddSectionDropdownIsOpen(false);
  };

  const sectionOptionsArr = sectionOptions.map((option) => (
    <p
      key={option.type}
      // className={styles.dropdownOption}
      onClick={() => handleAddSection(option.type)}
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        paddingBottom: "0.5rem",
        cursor: "pointer",
      }}
    >
      {option.label}
    </p>
  ));

  return (
    <div ref={dropdownRef}>
      <button
        className="buttonMain"
        style={{whiteSpace: 'nowrap'}}
        onClick={() => setAddSectionDropdownIsOpen(!addSectionDropdownIsOpen)}
      >
        + Add Section
      </button>
      {addSectionDropdownIsOpen && (
        <TextFormatDropdown
          dropdownOptions={sectionOptionsArr}
          wrapperClassName="flexColumn"
        />
        // <div className={styles.dropdownContainer}>
        //   <div className={styles.dropdownMenuWrapper}>
        //     {sectionOptions.map((option) => (
        //       <div
        //         key={option.type}
        //         className={styles.dropdownOption}
        //         onClick={() => handleAddSection(option.type)}
        //       >
        //         {option.label}
        //       </div>
        //     ))}
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default AddSection;
