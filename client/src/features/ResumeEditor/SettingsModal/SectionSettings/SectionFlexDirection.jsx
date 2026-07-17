import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";

import styles from "../SettingsModal.module.css";

const SectionFlexDirection = () => {
  const dispatch = useDispatch();

  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const section = useSelector(
    (state) => state.resume.sections.byId[activeSectionId],
  );

  const handleFlexDirectionChange = (e) => {
    const newFlexDirection = e.target.value;
    console.log("FLEX DIRECTION", newFlexDirection);
    dispatch(
      updateSection({
        id: section.id,
        changes: {
          layout: {
            display: "flex",
            flexDirection: newFlexDirection,
          },
        },
      }),
    );
  };

  return (
    <>
      <label htmlFor="flex-direction-select">Section Flex Direction:</label>
      <div className='flexRow'>
        <button
          className="buttonMain"
          value="row"
          onClick={(e) => handleFlexDirectionChange(e)}
        >
          Row
        </button>
        <button
          className="buttonMain"
          value="column"
          onClick={(e) => handleFlexDirectionChange(e)}
        >
          Column
        </button>
      </div>
    </>
  );
};

export default SectionFlexDirection;
