import React from "react";
import TextFormatButton from "../../TextFormatting/shared/TextFormatButton";
import styles from "@/features/ResumeEditor/TextFormatting/TextFormatting.module.css";
import { useDispatch, useSelector } from "react-redux";
import { updateResume } from "@/store/resumeSlice";
import { RxColumnSpacing, RxRowSpacing } from "react-icons/rx";

const Gap = ({ label, gapType }) => {
  const dispatch = useDispatch();
  const resumeGap = useSelector((state) => state.resume.layout.gap);

  const updateResumeGap = (incrementOrDecrement) => {
    const parsedCurrentGap = parseFloat(resumeGap[gapType]);
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

  return (
    <div className={styles.toolbarFlexWrapper}>
      <button className='buttonMain' onClick={() => updateResumeGap('decrement')}>-</button>
      {/* <button className={styles.textFormatButton}> */}
      <button className='buttonMain'>
        {gapType === "horizontal" && (
          <>
            <RxColumnSpacing style={{ position: "relative", top: "0.1em" }} />{" "}
            {resumeGap[gapType]}
          </>
        )}
        {gapType === "vertical" && (
          <>
            <RxRowSpacing style={{ position: "relative", top: "0.1em" }} />{" "}
            {resumeGap[gapType]}
          </>
        )}
      </button>
      {/* <ToolbarInput
            value={columnInputValue}
            handleChange={setColumnInputValue}
            commitChange={() => updateColumns()}
            onBlur={() => updateColumns()}
            /> */}
      <button className='buttonMain' onClick={() => updateResumeGap('increment')}>+</button>
      {/* <TextFormatButton text="+" command={() => updateResumeGap("increment")} /> */}
    </div>
  );
};

export default Gap;
