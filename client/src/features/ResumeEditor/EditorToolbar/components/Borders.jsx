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
import styles from "../../TextFormatting/TextFormatting.module.css";

const Borders = ({ activeSectionId, activeSectionIds }) => {
  const dispatch = useDispatch();
  const sectionsById = useSelector(
    (state) => state.resume.present.sections.byId,
  );
  const activeSectionBorder =
    sectionsById[activeSectionId]?.styling?.border || {};
  const hasActiveBorder = ["top", "bottom", "left", "right"].some(
    (side) => activeSectionBorder[side]?.display === true,
  );

  const [showBorderDropdown, setShowBorderDropdown] = useState(false);

  const handleBorderUpdate = (type, value) => {
    for (let sectionId of activeSectionIds) {
      const currentSectionBorder = sectionsById[sectionId]?.styling?.border;
      const currentSide = currentSectionBorder?.[type];
      const borderChanges =
        value.display === true
          ? { ...getBorderDefaults(currentSide, type), ...value }
          : value;
      dispatch(
        updateSection({
          id: sectionId,
          changes: {
            styling: {
              border: {
                ...currentSectionBorder,
                [type]: {
                  ...currentSide,
                  ...borderChanges,
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
      width:
        borderData.width ??
        (borderSide === "top" || borderSide === "bottom" ? "100%" : "1px"),
      height:
        borderData.height ??
        (borderSide === "top" || borderSide === "bottom" ? "1px" : "100%"),
      style: borderData.style ?? "solid",
      color: borderData.color ?? "rgba(0, 0, 0, 1)",
      display: true,
    };
  };

  const renderRepeatBorderElements = (borderSide) => {
    const sectionBorder =
      sectionsById[activeSectionId]?.styling?.border?.[borderSide] || {};
    const activeBorderStyle =
      sectionBorder.display === true ? sectionBorder.style || "solid" : null;

    return [
      <>
        <button data-toolbar-label="Width" className="buttonMain">
          <RxWidth style={{ scale: "1.25" }} />
        </button>
        {borderSide === "top" || borderSide === "bottom" ? (
          <>
            <input
              data-toolbar-label="Width"
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
                pointerEvents: "none",
              }}
            >
              %
            </span>
          </>
        ) : (
          <>
            <input
              data-toolbar-label="Width"
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
                pointerEvents: "none",
              }}
            >
              px
            </span>
          </>
        )}
      </>,
      <>
        <button data-toolbar-label="Height" className="buttonMain">
          <RxHeight style={{ scale: "1.25" }} />
        </button>
        {borderSide === "top" || borderSide === "bottom" ? (
          <>
            <input
              data-toolbar-label="Height"
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
                pointerEvents: "none",
              }}
            >
              px
            </span>
          </>
        ) : (
          <>
            <input
              data-toolbar-label="Height"
              className="inputMain"
              style={{ width: "3.5rem", paddingRight: "1rem" }}
              value={
                sectionBorder.height ? parseFloat(sectionBorder.height) : ""
              }
              type="number"
              step="0.1"
              placeholder="100"
              onChange={(e) => {
                handleBorderUpdate(borderSide, {
                  height: e.target.value + "%",
                });
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
                pointerEvents: "none",
              }}
            >
              %
            </span>
          </>
        )}
      </>,
      <button
        data-toolbar-label="Solid"
        aria-label={`${borderSide} border solid`}
        aria-pressed={activeBorderStyle === "solid"}
        className={`buttonMain ${styles.borderButton}`}
        onClick={() => handleBorderUpdate(borderSide, { style: "solid" })}
      >
        <RxBorderSolid style={{ scale: "1.25" }} />
      </button>,
      <button
        data-toolbar-label="Dashed"
        aria-label={`${borderSide} border dashed`}
        aria-pressed={activeBorderStyle === "dashed"}
        className={`buttonMain ${styles.borderButton}`}
        onClick={() => handleBorderUpdate(borderSide, { style: "dashed" })}
      >
        <RxBorderDashed style={{ scale: "1.25" }} />
      </button>,
      <button
        data-toolbar-label="Dotted"
        aria-label={`${borderSide} border dotted`}
        aria-pressed={activeBorderStyle === "dotted"}
        className={`buttonMain ${styles.borderButton}`}
        onClick={() => handleBorderUpdate(borderSide, { style: "dotted" })}
      >
        <RxBorderDotted style={{ scale: "1.25" }} />
      </button>,
      <div data-toolbar-label="Color" style={{ display: "contents" }}>
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
        />
      </div>,
    ];
  };

  const dropdownOptions = [
    {
      value: "top",
      elements: [
        <button
          data-toolbar-label="Top"
          aria-label="Top border"
          aria-pressed={activeSectionBorder.top?.display === true}
          className={`buttonMain ${styles.borderButton}`}
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.top?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("top", { display: false });
              return;
            }

            handleBorderUpdate("top", { display: true });
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
          data-toolbar-label="Bottom"
          aria-label="Bottom border"
          aria-pressed={activeSectionBorder.bottom?.display === true}
          className={`buttonMain ${styles.borderButton}`}
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.bottom?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("bottom", { display: false });
              return;
            }

            handleBorderUpdate("bottom", { display: true });
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
          data-toolbar-label="Left"
          aria-label="Left border"
          aria-pressed={activeSectionBorder.left?.display === true}
          className={`buttonMain ${styles.borderButton}`}
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.left?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("left", { display: false });
              return;
            }

            handleBorderUpdate("left", { display: true });
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
          data-toolbar-label="Right"
          aria-label="Right border"
          aria-pressed={activeSectionBorder.right?.display === true}
          className={`buttonMain ${styles.borderButton}`}
          onClick={() => {
            const currentDisplayValue = activeSectionBorder?.right?.display;

            if (currentDisplayValue === true) {
              handleBorderUpdate("right", { display: false });
              return;
            }

            handleBorderUpdate("right", { display: true });
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
    <div data-toolbar-label="Borders">
      <button
        aria-label="Borders"
        data-id="open-close-dropdown-button"
        aria-pressed={hasActiveBorder}
        aria-expanded={showBorderDropdown}
        className={`buttonMain ${styles.borderButton}`}
        onClick={() => setShowBorderDropdown(!showBorderDropdown)}
      >
        <MdBorderAll style={{ scale: "1.1" }} />
        <MdArrowDropDown style={{ marginRight: "-0.5rem" }} />
      </button>
      {showBorderDropdown && (
        <TextFormatDropdown
          isOpen={showBorderDropdown}
          setIsOpen={setShowBorderDropdown}
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
