import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";

import ToolbarButton from "../../EditorToolbar/components/shared/ToolbarButton";
import styles from "../SettingsModal.module.css";
import SectionFlexDirection from "./SectionFlexDirection";

const SectionJustifyContent = () => {
  const dispatch = useDispatch();

  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const section = useSelector(
    (state) => state.resume.sections.byId[activeSectionId],
  );

  const handleJustifyContentChange = (e) => {
    console.log(e.target);
    const newJustifyContent = e.target.value;
    dispatch(
      updateSection({
        id: section.id,
        changes: {
          layout: {
            display: "flex",
            justifyContent: newJustifyContent,
          },
        },
      }),
    );
  };

  return (
      <div className='flexColumn'>
        <label htmlFor="justifyContentOptions">Section Justify Content:</label>
        <div className="flexRow">
          <div className="flexColumn">
            <button
              className="buttonMain"
              value="start"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              Start
            </button>
            <button
              className="buttonMain"
              value="end"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              End
            </button>
            <button
              className="buttonMain"
              value="center"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              Center
            </button>
          </div>
          <div className="flexColumn">
            <button
              className="buttonMain"
              value="space-evenly"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              Space Evenly
            </button>
            <button
              className="buttonMain"
              value="space-between"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              Space Between
            </button>
            <button
              className="buttonMain"
              value="space-around"
              onClick={(e) => handleJustifyContentChange(e)}
            >
              Space Around
            </button>
          </div>
        </div>
      </div>
  );
};

export default SectionJustifyContent;
