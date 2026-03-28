import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addSection, updateField } from "../store/resumeSlice";

export const useDummyData = () => {
   const dispatch = useDispatch();
   const sections = useSelector((state) => state.resume.sections);
   const initialized = useRef(false);

   useEffect(() => {
      const sectionOptions = [
         { type: "header", label: "Header" },
         { type: "contact", label: "Contact" },
         { type: "workHistory", label: "Work History" },
         { type: "education", label: "Education" },
         { type: "skills", label: "Skills" },
         { type: "summary", label: "Summary" }
      ];
      if (initialized.current) return;

      // prevent adding if already exists
      console.log('SECTIONS IN USE DUMMY: ', sections)
      if (sections.allIds.length > 0) return;

      initialized.current = true;

      const resumeSampleDataArr = [
         "Connor", "Kormos", "test@email.com", "(123)456-7890",
         "Los Angeles, CA", "www.mywebsite.com", "test.linked.in",
         "Job Title", "Company", "Los Angeles", "Jan 2026 - Present",
         "Job description", "UCLA", "Bachelor of Science",
         "Software Engineering", "Los Angeles, CA",
         "Jan 2020 - Dec 2020", "School description",
         "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5",
         "Summary text/description"
      ];

      let wordIndex = 0;
      const getNextWord = () => {
         return resumeSampleDataArr[wordIndex++ % resumeSampleDataArr.length];
      }

      sectionOptions.forEach((option) => {
         dispatch(addSection(option.type));
      });
   }, [])
};