import React, { useState, useEffect, useRef } from 'react';

import AddSectionDropdown from './AddSectionDropdown';

import styles from "./Toolbar.module.css";

const AddSection = () => {
   const [addSectionDropdownIsOpen, setAddSectionDropdownIsOpen] = useState(false);
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

   return (
      <div className={styles.addSectionWrapperDiv} ref={dropdownRef}>
         <button
            className={styles.addSectionButton}
            onClick={() => setAddSectionDropdownIsOpen((prev) => !prev)}
         >
            + Add Section
         </button>
         {addSectionDropdownIsOpen && (
            <AddSectionDropdown setAddSectionDropdownIsOpen={setAddSectionDropdownIsOpen} />
         )}
      </div>
   );
};

export default AddSection;