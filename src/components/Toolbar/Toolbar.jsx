import React, { useState, useRef, useEffect } from "react";
import styles from "./Toolbar.module.css";

import RichTextToolbar from "./RichTextToolbar.jsx";

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";
import { nanoid } from "@reduxjs/toolkit";

const Toolbar = () => {
  // Function to add each section type, as well as default data for each section upon page load.  Just use lorem ipsum text, with each word filling in each subsection field
  const initialized = useRef(false);
  const addDefaultSections = () => {
    if (sections.length > 0) return; // Prevent adding sections if already present
  
    const resumeSampleDataArr = ["Connor", "Kormos", "test@email.com", "(123)456-7890", "Los Angeles, CA", "www.mywebsite.com", "test.linked.in", "Job Title", "Company", "Los Angeles", "Jan 2026", "Present", "Job description", "UCLA", "Bachelor of Science", "Software Engineering", "Los Angeles, CA", "Jan 2020", "Dec 2020", "School description", "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Summary text/description"];
    let wordIndex = 0;
    const getNextWord = () => resumeSampleDataArr[wordIndex++ % resumeSampleDataArr.length];
  
    sectionOptions.forEach((option) => {
      const action = addSection(option.type);
      const data = action.payload.data;
  
      data.subsections.forEach(sub => {
        sub.fields.forEach(field => {
          field.value = [{ type: "paragraph", children: [{ text: getNextWord(), fontSize: '12px' }] }];
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

  const dispatch = useDispatch();
  const sections = useSelector((state) => state.resume.sections);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Add a section OR append a subsection if it already exists
  const handleAddOrAppend = (type, subsectionData = {}, sectionData = null) => {
    const existing = sections.find((s) => s.type === type);

    if (!existing) {
      if (sectionData) {
        const action = addSection(type);
        action.payload.data = sectionData;
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


  const sectionOptions = [
    { type: "header", label: "Header" },
    { type: "contact", label: "Contact" },
    { type: "workHistory", label: "Work History" },
    { type: "education", label: "Education" },
    { type: "skills", label: "Skills" },
    { type: "summary", label: "Summary" }
  ];

  return (
    <div className={styles.toolbarContainerDiv} ref={dropdownRef}>
      <RichTextToolbar />
      <div className={styles.addSectionWrapperDiv}>
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
    </div>
  );
};

export default Toolbar;