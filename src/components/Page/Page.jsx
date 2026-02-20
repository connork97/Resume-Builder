import React, { useState } from "react";
import styles from "./Page.module.css";

const Page = React.forwardRef(({ children, zoom }, ref) => {

  const findMarginBottom = () => {
    const defaultMarginBottom = 85;
    const extraMarginBottom = defaultMarginBottom * (zoom - 1);
    return `${4 + extraMarginBottom}vh`;
  };

  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.page}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          marginBottom: findMarginBottom()
        }}
      >
        <div className={styles.pageContentWrapper} ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
});

export default Page;