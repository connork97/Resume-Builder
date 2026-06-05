import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addSection } from "../store/resumeSlice";

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
      if (sections.allIds.length > 0) return;

      initialized.current = true;

      sectionOptions.forEach((option) => {
         dispatch(addSection(option.type));
      });
   }, [dispatch, sections.allIds.length])
};
