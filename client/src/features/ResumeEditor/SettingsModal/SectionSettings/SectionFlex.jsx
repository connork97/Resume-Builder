import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";

import styles from "../SettingsModal.module.css";

const SectionFlex = () => {
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


// ! JUSTIFY CONTENT JAVASCRIPT ! //


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

  const justifyContentButtons = (startIndex, endIndex) => {
    const buttons = [
      { text: "Start", value: "start" },
      { text: "End", value: "end" },
      { text: "Center", value: "center" },
      { text: "Space Evenly", value: "space-evenly" },
      { text: "Space Between", value: "space-between" },
      { text: "Space Around", value: "space-around" },
    ];
    return buttons.map((button, index) => {
      if (index >= startIndex && index <= endIndex) {
        return (
          <button
            className="buttonMain"
            value={button.value}
            onClick={(e) => handleJustifyContentChange(e)}
          >
            {button.text}
          </button>
        );
      }
    });
  };

  return (
    <>
      <label htmlFor="flex-direction-select">Section Flex Direction:</label>
      <div className="flexRow">
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
      <div className="flexColumn">
        <label htmlFor="justifyContentOptions">Section Justify Content:</label>
        <div className="flexRow">
          <div className="flexColumn">{justifyContentButtons(0, 2)}</div>
          <div className="flexColumn">{justifyContentButtons(3, 5)}</div>
        </div>
      </div>
    </>
  );
};

export default SectionFlex;
