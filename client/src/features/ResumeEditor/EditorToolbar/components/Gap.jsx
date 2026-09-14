import React, { useState } from "react";
import styles from "@/features/ResumeEditor/TextFormatting/TextFormatting.module.css";
import { useDispatch, useSelector } from "react-redux";
import { updateResume } from "@/store/resumeSlice";
import { RxColumnSpacing, RxRowSpacing } from "react-icons/rx";
import TextFormatDropdown from "../../TextFormatting/shared/TextFormatDropdown";
import { MdArrowDropDown } from "react-icons/md";

const Gap = () => {
  const dispatch = useDispatch();
  const resumeGap = useSelector((state) => state.resume.present.layout.gap);

  const updateResumeGap = (incrementOrDecrement, gapType) => {
    let parsedCurrentGap = 0;
    if (resumeGap[gapType]) parsedCurrentGap = parseFloat(resumeGap[gapType]);
    const updatedGap =
      parseFloat(
        parsedCurrentGap + (incrementOrDecrement == "increment" ? 0.1 : -0.1),
      ).toFixed(1) + "rem";
    if (parseFloat(updatedGap).toFixed(1) < 0) {
      alert("Gap may not be a negative value.");
      return;
    }
    dispatch(
      updateResume({
        key: "layout",
        changes: {
          gap: {
            // horizontal: '1rem',
            // vertical: '0.5rem'
            ...resumeGap,
            [gapType]: updatedGap,
          },
        },
      }),
    );
  };

  const [gapDropdownIsOpen, setGapDropdownIsOpen] = useState(false);

  const gapOptions = [
    {
      label: "Column Gap",
      value: resumeGap.horizontal || '0rem',
      icon: <RxColumnSpacing />,
      gapType: "horizontal",
    },
    {
      label: "Section Gap",
      value: resumeGap.vertical || '0rem',
      icon: <RxRowSpacing />,
      gapType: "vertical",
    },
    {
      label: "Subsection Gap",
      value: resumeGap.subsection || '0rem',
      icon: <RxRowSpacing />,
      gapType: "subsection",
    },
    {
      label: "Field Gap",
      value: resumeGap.field || '0rem',
      icon: <RxRowSpacing />,
      gapType: "field",
    }
  ];

  const gapOptionsArr = gapOptions.map((option) => (
    <div
      key={option.gapType}
      className={styles.toolbarFlexWrapper}
      style={{ justifyContent: "space-between" }}
    >
      <span>{option.label}</span>
      <div className={styles.toolbarFlexWrapper}>
        <button
          className="buttonMain"
          onClick={() => updateResumeGap("decrement", option.gapType)}
        >
          -
        </button>
        <button key={option.gapType} className="buttonMain">
          {option.icon} {option.value}
        </button>
        <button
          className="buttonMain"
          onClick={() => updateResumeGap("increment", option.gapType)}
        >
          +
        </button>
      </div>
    </div>
  ));

  return (
    <div>
      <button
        className="buttonMain"
        data-id="open-close-dropdown-button"
        onClick={() => setGapDropdownIsOpen(!gapDropdownIsOpen)}
      >
        Gap & Spacing{" "}
        <MdArrowDropDown style={{ margin: "auto -0.25rem auto 0.25rem" }} />
      </button>
      {gapDropdownIsOpen && (
        <TextFormatDropdown
          isOpen={gapDropdownIsOpen}
          setIsOpen={setGapDropdownIsOpen}
          dropdownOptions={gapOptionsArr}
          wrapperStyling={{ display: "flex", flexDirection: "column" }}
        />
      )}
    </div>
    //  <div className={styles.toolbarFlexWrapper}>
    //    <button className='buttonMain' onClick={() => updateResumeGap('decrement')}>-</button>
    //    <button className='buttonMain'>
    //      {gapType === "horizontal" && (
    //        <>
    //          <RxColumnSpacing style={{ position: "relative", top: "0.1em" }} />{" "}
    //          {resumeGap[gapType]}
    //        </>
    //      )}
    //      {gapType === "vertical" && (
    //        <>
    //          <RxRowSpacing style={{ position: "relative", top: "0.1em" }} />{" "}
    //          {resumeGap[gapType]}
    //        </>
    //      )}
    //    </button>
    //    <button className='buttonMain' onClick={() => updateResumeGap('increment')}>+</button>
    //  </div>
  );
};

export default Gap;
