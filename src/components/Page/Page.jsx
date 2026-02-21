import React, { useRef, useEffect, useState } from "react";
import styles from "./Page.module.css";

const Page = React.forwardRef(({ children, zoom }, ref) => {

  // const findMarginBottom = () => {
  //   const defaultMarginBottom = 85;
  //   const extraMarginBottom = defaultMarginBottom * (zoom - 1);
  //   return `${4 + extraMarginBottom}vh`;
  // };


  const PAGE_HEIGHT = 1062;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new ResizeObserver(() => {
      setContentHeight(ref.current.scrollHeight);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);



  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.page}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
      >
        <div className={styles.pageContentWrapper} ref={ref}>
          {children}
        </div>
        {Array.from({ length: Math.floor(contentHeight / PAGE_HEIGHT) }).map((_, i) => (
          <div
            key={i}
            className={styles.pageBreakIndicator}
            style={{ top: PAGE_HEIGHT * (i + 1) }}
          />
        ))}
      </div>

    </div>
  );
});


export default Page;