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

  const resetNodeOffsets = (nodes, resetOption) => {
    nodes.forEach((node) => {
      if (resetOption === "fontSize" && node.fontSizeOffset !== undefined) {
        node.fontSizeOffset = 0;
      }
      if (resetOption === "lineHeight" && node.lineHeightOffset !== undefined) {
        node.lineHeightOffset = 0;
      }

      if (node.children) {
        resetNodeOffsets(node.children, resetOption);
      }
    });
  };

  const handleSaveStylingReset = () => {
    console.log("Saved styling reset options:", checkedResetOptions);
    checkedResetOptions.forEach((resetOption) => {
      console.log(`Resetting styling for: ${resetOption}`);
      if (resetOption === "columnSpacing") {
        dispatch(
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
          dispatch(
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
          dispatch(
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
        dispatch(
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
          dispatch(
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
          dispatch(
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
      if (resetOption === "fontSize" || resetOption === "lineHeight") {
        dispatch(
          updateResume({
            key: "styling",
            changes: {
              [resetOption]: initialResumeStyling[resetOption],
            },
          }),
        );
        reduxResume.columns.allIds.forEach((columnId) => {
          dispatch(
            updateColumn({
              id: columnId,
              changes: {
                styling: {
                  [resetOption + 'Offset']: 0,
                },
              },
            }),
          );
        });
        reduxResume.sections.allIds.forEach((sectionId) => {
          const section = reduxResume.sections.byId[sectionId];
          const fieldValueCopy = structuredClone(section.value);
          checkedResetOptions.forEach((option) => {
            resetNodeOffsets(fieldValueCopy, option);
          });
          dispatch(
            updateSection({
              id: sectionId,
              changes: {
                styling: {
                  [resetOption + 'Offset']: 0,
                },
                value: fieldValueCopy,
              },
            }),
          );
        });
        reduxResume.subsections.allIds.forEach((subsectionId) => {
          dispatch(
            updateSubsection({
              subsectionId: subsectionId,
              changes: {
                styling: {
                  [resetOption + 'Offset']: 0,
                },
              },
            }),
          );
        });
        reduxResume.fields.allIds.forEach((fieldId) => {
          const field = reduxResume.fields.byId[fieldId];
          const fieldValueCopy = structuredClone(field.value);
          checkedResetOptions.forEach((option) => {
            resetNodeOffsets(fieldValueCopy, option);
          });

          dispatch(
            updateField({
              id: fieldId,
              changes: {
                styling: {
                  [resetOption + 'Offset']: 0,
                },
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
      label: "Reset Column Gap/Spacing",
      value: "columnSpacing",
    },
    {
      label: "Reset Section Gap/Spacing",
      value: "sectionSpacing",
    }
  ];

  const dropdownOptionElements = dropdownOptions.map((option, index) => (
    <div key={index} style={{ display: 'flex', justifyContent: 'space-between'}}>
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
