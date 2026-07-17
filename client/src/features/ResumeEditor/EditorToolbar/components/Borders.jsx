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
  const activeSectionBorder =
    sectionsById[activeSectionId]?.styling?.border || {};

  const [showBorderDropdown, setShowBorderDropdown] = useState(false);

  const handleBorderUpdate = (type, value) => {
    if (activeSectionIds.length > 0) {
      for (let sectionId of activeSectionIds) {
        const currentSectionBorder = sectionsById[sectionId]?.styling?.border;
        dispatch(
          updateSection({
            id: sectionId,
            changes: {
              styling: {
                border: {
                  ...currentSectionBorder,
                  [type]: {
                    ...currentSectionBorder?.[type],
                    ...value,
                  },
                },
              },
            },
          }),
        );
      }
    } else if (activeSectionId) {
      const currentSectionBorder =
        sectionsById[activeSectionId]?.styling?.border;
      dispatch(
        updateSection({
          id: activeSectionId,
          changes: {
            styling: {
              border: {
                ...currentSectionBorder,
                [type]: {
                  ...currentSectionBorder?.[type],
                  ...value,
                },
              },
            },
          },
        }),
      );
    }
  };

  const getBorderDefaults = (borderData = {}, borderSide) => {

     return {
        ...borderData,
        width: borderData.width ?? (borderSide === 'top' || borderSide === 'bottom') ? "100%" : '1px',
        height: borderData.height ?? (borderSide === 'top' || borderSide === 'bottom') ? "1px" : "100%",
        style: borderData.style ?? "solid",
        color: borderData.color ?? "rgba(0, 0, 0, 1)",
        display: true,
      }
};

  const renderRepeatBorderElements = (borderSide) => {
    const sectionBorder =
      sectionsById[activeSectionId]?.styling?.border?.[borderSide] || {};

    return [
      <>
        <button className="buttonMain">
          <RxWidth style={{ scale: "1.25" }} />
        </button>
        {borderSide === "top" || borderSide === "bottom" ? (
          <>
            <input
              className="inputMain"
              style={{ width: "3.5rem", paddingRight: "1rem" }}
              value={sectionBorder.width ? parseFloat(sectionBorder.width) : ""}
              type="number"
              step="0.1"
              placeholder="100"
              onChange={(e) => {
                handleBorderUpdate(borderSide, { width: e.target.value + "%" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBorderUpdate(borderSide, {
                    width: e.target.value + "%",
                  });
                }
              }}
            />
            <span
              style={{
                position: "relative",
                margin: "0.25rem 0.5rem auto -1.75rem",
                pointerEvents: 'none',
              }}
            >
              %
            </span>
          </>
        ) : (
          <>
            <input
              className="inputMain"
              style={{
                width: "3rem",
                paddingRight: "1rem",
                paddingLeft: "0.5rem",
                textAlign: "left",
              }}
              type="number"
              step="0.1"
              placeholder="0"
              onChange={(e) => {
                handleBorderUpdate(borderSide, {
                  width: e.target.value + "px",
                });
              }}
              value={sectionBorder.width ? parseFloat(sectionBorder.width) : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBorderUpdate(borderSide, {
                    width: e.target.value + "px",
                  });
                }
              }}
            />
            <span
              style={{
                position: "relative",
                margin: "0.25rem 0.5rem auto -2rem",
                pointerEvents: 'none',
              }}
            >
              px
            </span>
          </>
        )}
      </>,
      <>
        <button className="buttonMain">
          <RxHeight style={{ scale: "1.25" }} />
        </button>
        {borderSide === "top" || borderSide === "bottom" ? (
          <>
            <input
              className="inputMain"
              style={{
                width: "3rem",
                paddingRight: "1rem",
                paddingLeft: "0.5rem",
                textAlign: "left",
              }}
              type="number"
              step="0.1"
              placeholder="0"
              onChange={(e) => {
                handleBorderUpdate(borderSide, {
                  height: e.target.value + "px",
                });
              }}
              value={
                sectionBorder.height ? parseFloat(sectionBorder.height) : ""
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBorderUpdate(borderSide, {
                    height: e.target.value + "px",
                  });
                }
              }}
            />
            <span
              style={{
                position: "relative",
                margin: "0.25rem 0.5rem auto -2rem",
                pointerEvents: 'none',
              }}
            >
              px
            </span>
          </>
        ) : (
          <>
            <input
              className="inputMain"
              style={{ width: "3.5rem", paddingRight: "1rem" }}
              value={sectionBorder.height ? parseFloat(sectionBorder.height) : ""}
              type="number"
              step="0.1"
              placeholder="100"
              onChange={(e) => {
                handleBorderUpdate(borderSide, { height: e.target.value + "%" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBorderUpdate(borderSide, {
                    height: e.target.value + "%",
                  });
                }
              }}
            />
            <span
              style={{
                position: "relative",
                margin: "0.25rem 0.5rem auto -1.75rem",
                pointerEvents: 'none',
              }}
            >
              %
            </span>
          </>
        )}
      </>,
      <button
        className="buttonMain"
        onClick={() => handleBorderUpdate(borderSide, { style: "solid" })}
      >
        <RxBorderSolid style={{ scale: "1.25" }} />
      </button>,
      <button
        className="buttonMain"
        onClick={() => handleBorderUpdate(borderSide, { style: "dashed" })}
      >
        <RxBorderDashed style={{ scale: "1.25" }} />
      </button>,
      <button
        className="buttonMain"
        onClick={() => handleBorderUpdate(borderSide, { style: "dotted" })}
      >
        <RxBorderDotted style={{ scale: "1.25" }} />
      </button>,
      <ColorDropdown
        text={
          <FaSquare
            style={{
              scale: "1.5",
              color: sectionBorder.color || "rgba(0, 0, 0, 1)",
            }}
          />
        }
        currentEditorColor={sectionBorder.color || "rgba(0, 0, 0, 1)"}
        handleSetColor={(color) =>
          handleBorderUpdate(borderSide, { color: color })
        }
      />,
    ];
  };

  const dropdownOptions = [
    {
      value: "top",
      elements: [
        <button
          className="buttonMain"
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.top?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("top", { display: false });
              return;
            }

            handleBorderUpdate(
              "top",
              getBorderDefaults(activeSectionBorder?.top, 'top'),
            );
          }}
        >
          <CgBorderTop style={{ scale: "1.75" }} />
        </button>,
        renderRepeatBorderElements("top"),
      ],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
      // command: () => handleBorderUpdate("top", {width: '100%', height: '1px', style: 'solid', color: 'red'}),
    },
    {
      value: "bottom",
      elements: [
        <button
          className="buttonMain"
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.bottom?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("bottom", { display: false });
              return;
            }

            handleBorderUpdate(
              "bottom",
              getBorderDefaults(activeSectionBorder?.bottom, 'bottom'),
            );
          }}
        >
          <CgBorderBottom style={{ scale: "1.75" }} />
        </button>,
        renderRepeatBorderElements("bottom"),
      ],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
    },
    {
      value: "left",
      elements: [
        <button
          className="buttonMain"
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.left?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("left", { display: false });
              return;
            }

            handleBorderUpdate(
              "left",
              getBorderDefaults(activeSectionBorder?.left, 'left'),
            );
          }}
        >
          <CgBorderLeft style={{ scale: "1.75" }} />
        </button>,
        renderRepeatBorderElements("left"),
      ],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
    },
        {
      value: "right",
      elements: [
        <button
          className="buttonMain"
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.right?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("right", { display: false });
              return;
            }

            handleBorderUpdate(
              "right",
              getBorderDefaults(activeSectionBorder?.right, 'right'),
            );
          }}
        >
          <CgBorderRight style={{ scale: "1.75" }} />
        </button>,
        renderRepeatBorderElements("right"),
      ],
      styling: { display: "flex", flexDirection: "row", gap: "0.5rem" },
    },
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
          wrapperStyling={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
          // containerStyling={{ display: "flex", flexDirection: "column",
          containerStyling={{
            transform: "translateX(-80%)",
          }}
        />
      )}
    </div>
  );
};

export default Borders;
