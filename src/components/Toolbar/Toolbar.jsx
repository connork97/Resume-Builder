import React, { useState, useRef, useEffect } from "react";
import styles from "./Toolbar.module.css";

import RichTextToolbar from "./RichTextToolbar.jsx";

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";

const Toolbar = () => {
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
  const handleAddOrAppend = (type) => {
    const existing = sections.find((s) => s.type === type);

    if (!existing) {
      dispatch(addSection(type));
    } else {
      dispatch(
        addSubsection({
          sectionId: existing.id,
          subsectionData: {}
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