import { MdArrowDropDown } from "react-icons/md";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateColumn,
  updateResume,
  updateSection,
  updateSubsection,
  updateField,
} from "@/store/resumeSlice";
import TextFormatDropdown from "../../TextFormatting/shared/TextFormatDropdown";

import { initialState } from "@/store/resumeSlice";

export default function ResetStyling() {
  const dispatch = useDispatch();
  const initialResumeStyling = initialState.styling;
  const reduxResume = useSelector((state) => state.resume.present);

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [checkedResetOptions, setCheckedResetOptions] = useState([]);

  const resetNodeStyling = (nodes, resetOption) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node) => {
      if (resetOption === "fontSize" && node.fontSizeOffset !== undefined) {
        node.fontSizeOffset = 0;
      }
      if (resetOption === "lineHeight" && node.lineHeightOffset !== undefined) {
        node.lineHeightOffset = 0;
      }
      if (resetOption === "color") {
        delete node.color;
        delete node.iconColor;
      }
      if (resetOption === "highlightColor") {
        delete node.highlightColor;
      }

      if (node.children) {
        resetNodeStyling(node.children, resetOption);
      }
    });
  };

  const handleSaveStylingReset = () => {
    console.log("Saved styling reset options:", checkedResetOptions);
    const historyGroup = `reset-styling:${crypto.randomUUID()}`;

    const dispatchReset = (action) => {
      dispatch({
        ...action,
        meta: {
          ...action.meta,
          historyGroup,
        },
      });
    };
    checkedResetOptions.forEach((resetOption) => {
      console.log(`Resetting styling for: ${resetOption}`);
      if (resetOption === "borders") {
         const reduxSections = reduxResume.sections.allIds;
         reduxSections.forEach((sectionId) => {
           dispatchReset(
             updateSection({
               id: sectionId,
               changes: {
                 styling: {
                   border: {},
                 },
               },
             }),
           );
         });
      }
      if (resetOption === "resumeMargins") {
        dispatchReset(
          updateResume({
            key: "layout",
            changes: {
              padding: { ...initialState.layout.padding },
            },
          }),
        );
      }
      if (resetOption === "columnSpacing") {
        dispatchReset(
          updateResume({
            key: "layout",
            changes: {
              gap: {
                horizontal: initialState.layout.gap.horizontal,
              },
            },
          }),
        );
        const columns = reduxResume.columns.allIds;
        columns.forEach((columnId) => {
          dispatchReset(
            updateColumn({
              id: columnId,
              changes: {
                layout: {
                  padding: {
                    left: "0rem",
                    right: "0rem",
                  },
                },
              },
            }),
          );
        });
        const sections = reduxResume.sections.allIds;
        sections.forEach((sectionId) => {
          dispatchReset(
            updateSection({
              id: sectionId,
              changes: {
                layout: {
                  padding: {
                    left: "0rem",
                    right: "0rem",
                  },
                },
              },
            }),
          );
        });
      }
      if (resetOption === "sectionSpacing") {
        dispatchReset(
          updateResume({
            key: "layout",
            changes: {
              gap: {
                vertical: initialState.layout.gap.vertical,
              },
            },
          }),
        );
        reduxResume.columns.allIds.forEach((columnId) => {
          dispatchReset(
            updateColumn({
              id: columnId,
              changes: {
                layout: {
                  padding: {
                    top: "0rem",
                    bottom: "0rem",
                  },
                },
              },
            }),
          );
        });
        const sections = reduxResume.sections.allIds;
        sections.forEach((sectionId) => {
          dispatchReset(
            updateSection({
              id: sectionId,
              changes: {
                layout: {
                  padding: {
                    top: "0rem",
                    bottom: "0rem",
                  },
                },
              },
            }),
          );
        });
      }
      if (
        ["fontSize", "lineHeight", "color", "highlightColor"].includes(
          resetOption,
        )
      ) {
        // Null clears the local color override so text inherits the resume color.
        const stylingChanges =
          resetOption === "color"
            ? { color: null }
            : resetOption === "highlightColor"
              ? {}
              : { [resetOption + "Offset"]: 0 };

        if (resetOption !== "highlightColor") {
          dispatchReset(
            updateResume({
              key: "styling",
              changes: {
                [resetOption]: initialResumeStyling[resetOption],
              },
            }),
          );
          reduxResume.columns.allIds.forEach((columnId) => {
            dispatchReset(
              updateColumn({
                id: columnId,
                changes: {
                  styling: stylingChanges,
                },
              }),
            );
          });
        }
        reduxResume.sections.allIds.forEach((sectionId) => {
          const section = reduxResume.sections.byId[sectionId];
          const fieldValueCopy = structuredClone(section.value);
          checkedResetOptions.forEach((option) => {
            resetNodeStyling(fieldValueCopy, option);
          });
          dispatchReset(
            updateSection({
              id: sectionId,
              changes: {
                styling: stylingChanges,
                value: fieldValueCopy,
              },
            }),
          );
        });
        if (resetOption !== "highlightColor") {
          reduxResume.subsections.allIds.forEach((subsectionId) => {
            dispatchReset(
              updateSubsection({
                subsectionId: subsectionId,
                changes: {
                  styling: stylingChanges,
                },
              }),
            );
          });
        }
        reduxResume.fields.allIds.forEach((fieldId) => {
          const field = reduxResume.fields.byId[fieldId];
          const fieldValueCopy = structuredClone(field.value);
          checkedResetOptions.forEach((option) => {
            resetNodeStyling(fieldValueCopy, option);
          });

          dispatchReset(
            updateField({
              id: fieldId,
              changes: {
                styling: stylingChanges,
                value: fieldValueCopy,
              },
            }),
          );
        });
      }
    });
    setCheckedResetOptions([]);
    setDropdownIsOpen(false);
  };

  const dropdownOptions = [
    {
      label: "Reset Font Size",
      value: "fontSize",
    },
    {
      label: "Reset Line Height",
      value: "lineHeight",
    },
    {
      label: "Reset Text Color",
      value: "color",
    },
    {
      label: "Remove Highlights",
      value: "highlightColor",
    },
    {
      label: "Reset Column Gap/Spacing",
      value: "columnSpacing",
    },
    {
      label: "Reset Section Gap/Spacing",
      value: "sectionSpacing",
    },
    {
      label: "Reset Resume Margins",
      value: "resumeMargins",
    },
    {
      label: "Reset Borders",
      value: "borders",
    },
  ];

  const dropdownOptionElements = dropdownOptions.map((option, index) => (
    <div
      key={index}
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <span>{option.label}</span>
      <input
        type="checkbox"
        data-id="dropdown-checkbox-input"
        onChange={() => {
          const newCheckedOptions = [...checkedResetOptions];
          if (newCheckedOptions.includes(option.value)) {
            const index = newCheckedOptions.indexOf(option.value);
            newCheckedOptions.splice(index, 1);
          } else {
            newCheckedOptions.push(option.value);
          }
          setCheckedResetOptions(newCheckedOptions);
        }}
        checked={checkedResetOptions.includes(option.value)}
        style={{ marginLeft: "1rem" }}
      />
    </div>
  ));

  dropdownOptionElements.push(
    <button
      className="buttonMain"
      style={{ margin: "auto" }}
      onClick={handleSaveStylingReset}
    >
      Save
    </button>,
  );

  return (
    <div>
      <button
        className="buttonMain"
        data-id="open-close-dropdown-button"
        onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
      >
        Reset Styling{" "}
        <MdArrowDropDown
          style={{ marginLeft: "0.25rem", marginRight: "-0.25rem" }}
        />
      </button>
      {dropdownIsOpen && (
        <TextFormatDropdown
          dropdownOptions={dropdownOptionElements}
          wrapperStyling={{ flexDirection: "column", width: "max-content" }}
          isOpen={dropdownIsOpen}
          setIsOpen={setDropdownIsOpen}
        />
      )}
    </div>
  );
}
