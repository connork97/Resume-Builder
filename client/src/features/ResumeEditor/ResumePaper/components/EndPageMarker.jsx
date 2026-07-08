import React, { useEffect, useState } from "react";

import styles from "../ResumePaper.module.css";

const EndPageMarker = ({ pageRef }) => {
  const [showEndPageMarker, setShowEndPageMarker] = useState(false);

  useEffect(() => {
    const page = pageRef?.current;

    if (!page) return;

    let animationFrameId = null;
    const observedElements = new Set();

    const getColumns = () => {
      return Array.from(page.querySelectorAll(`.${styles.columnWrapperDiv}`));
    };

    const getColumnContentHeight = (column) => {
      return Array.from(column.children).reduce((totalHeight, childElement) => {
        return totalHeight + childElement.getBoundingClientRect().height;
      }, 0);
    };

    const checkPageLength = () => {
      const pageIsTooLong = getColumns().some((column) => (
        getColumnContentHeight(column) > column.getBoundingClientRect().height + 1
      ));

      setShowEndPageMarker((previousValue) => (
        previousValue === pageIsTooLong ? previousValue : pageIsTooLong
      ));
    };

    const scheduleMeasure = () => {
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        checkPageLength();
      });
    };

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(scheduleMeasure)
      : null;

    const observeElementSize = (element) => {
      if (!resizeObserver || observedElements.has(element)) return;

      resizeObserver.observe(element);
      observedElements.add(element);
    };

    const observeColumnSizes = () => {
      getColumns().forEach((column) => {
        observeElementSize(column);
        Array.from(column.children).forEach(observeElementSize);
      });
    };

    const mutationObserver = new MutationObserver(() => {
      observeColumnSizes();
      scheduleMeasure();
    });

    mutationObserver.observe(page, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });

    observeColumnSizes();
    window.addEventListener("resize", scheduleMeasure);
    scheduleMeasure();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [pageRef]);

  if (!showEndPageMarker) return null;

  return <div className={styles.endPageMarker}>Page is to long</div>;
};

export default EndPageMarker;
