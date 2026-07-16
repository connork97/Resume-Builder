import React, { useState } from "react";
import { BsBorderOuter } from "react-icons/bs";
import { FaBorderAll, FaSquare } from "react-icons/fa";
import {
  MdArrowDropDown,
  MdBorderAll,
  MdBorderBottom,
  MdBorderOuter,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import TextFormatDropdown from "../../TextFormatting/shared/TextFormatDropdown";
import {
  CgBorderBottom,
  CgBorderLeft,
  CgBorderRight,
  CgBorderTop,
} from "react-icons/cg";
import {
  RxBorderSolid,
  RxBorderDashed,
  RxBorderDotted,
  RxWidth,
  RxHeight,
} from "react-icons/rx";
import ColorDropdown from "../../TextFormatting/shared/ColorDropdown";
import { updateSection } from "@/store/resumeSlice";

const Borders = () => {
  const dispatch = useDispatch();
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const activeSectionIds = useSelector(
    (state) => state.resume.activeSectionIds,
  );
  const sectionsById = useSelector((state) => state.resume.sections.byId);

  const [showBorderDropdown, setShowBorderDropdown] = useState(false);

  const handleBorderUpdate = (type, value) => {
    console.log(
      "handleBorderUpdate called with type:",
      type,
      "and value:",
      value,
    );
    if (activeSectionIds.length > 0) {
      for (let sectionId of activeSectionIds) {
        dispatch(
          updateSection({
            id: sectionId,
            changes: {
              styling: {
                border: {
                  [type]: value,
                },
              },
            },
          }),
        );
      }
    } else if (activeSectionId) {
      const currentSectionBorder =
        sectionsById[activeSectionId].styling?.border;
      dispatch(
        updateSection({
          id: activeSectionId,
          changes: {
            styling: {
              border: {
                ...currentSectionBorder,
                [type]: value,
              },
            },
          },
        }),
      );
    }
  };

  const repeatBorderElementsArr = [
    <RxBorderSolid style={{ scale: "1.25" }} />,
    //  <RxBorderDashed style={{ scale: "1.25" }} />,
    //  <RxBorderDotted style={{ scale: "1.25" }} />,
    //  <RxWidth style={{ scale: "1.25" }} />,
    //  <RxHeight style={{ scale: "1.25" }} />,

    //  <ColorDropdown
    //    skipButton={true}
    //    text={<FaSquare style={{ scale: "2", margin: "-1rem" }} />}
    //    currentEditorColor={"rgba(0, 0, 0, 1)"}
    //  />,
  ];

  const renderRepeatBorderElements = (borderSide) => {
    return [
      <RxBorderSolid style={{ scale: "1.25" }} />,
      <RxBorderDashed style={{ scale: "1.25" }} />,
      <RxBorderDotted style={{ scale: "1.25" }} />,
    ];
  };

  const dropdownOptions = [
    {
      value: "top",
      elements: [<CgBorderTop style={{ scale: "1.75" }} />],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
      command: () => handleBorderUpdate("top", { width: "90%" }),

      // command: () => handleBorderUpdate("top", {width: '100%', height: '1px', style: 'solid', color: 'red'}),
      // command: () => handleDropdownSelection("left"),
    },
    {
      value: "bottom",
      elements: [
        <CgBorderBottom style={{ scale: "1.75" }} />,
      //   ...repeatBorderElementsArr,
      ],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
      command: () => handleBorderUpdate("bottom", { width: "90%" }),
      // command: () => handleBorderUpdate("bottom", {width: '100%', height: '1px', style: 'solid', color: 'red'}),

      // command: () => handleDropdownSelection("left"),
    },
    //  {
    //    value: "left",
    //    elements: [
    //      <CgBorderLeft style={{ scale: "1.75" }} />,
    //      ...repeatBorderElementsArr,
    //    ],
    //    styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
    //    command: () => handleBorderUpdate("left", {width: '100%', height: '1px', style: 'solid', color: 'red'}),
    //    // command: () => handleDropdownSelection("left"),
    //  },
    //  {
    //    value: "right",
    //    elements: [
    //      <CgBorderRight style={{ scale: "1.75" }} />,
    //      ...repeatBorderElementsArr,
    //    ],
    //    styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
    //    command: () => handleBorderUpdate("right", {width: '100%', height: '1px', style: 'solid', color: 'red'}),
    //    // command: () => handleDropdownSelection("left"),
    //  },
  ];
  return (
    <div>
      <button
        className="buttonMain"
        onClick={() => setShowBorderDropdown(!showBorderDropdown)}
      >
        <MdBorderAll style={{ scale: "1.1" }} />
        <MdArrowDropDown style={{ marginRight: "-0.5rem" }} />
      </button>
      {showBorderDropdown && (
        <TextFormatDropdown
          dropdownOptions={dropdownOptions}
          styling={{ display: "flex", flexDirection: "column" }}
        />
      )}
    </div>
  );
};

export default Borders;
