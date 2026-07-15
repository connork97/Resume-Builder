import React, { useEffect, useState } from "react";
import { getActiveMark, setLink } from "@/helpers/marks";
import styles from "./TextFormatting.module.css";
import { FaLink } from "react-icons/fa6";

const Links = ({ editor }) => {
  const [linkText, setLinkText] = useState("");

  const normalizeLink = (value) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    // Keep http:// or https:// unchanged when provided
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Defaults URLs to HTTPS if not provided
    return `https://${trimmed}`;
  };

  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleCommitLink = () => {
    const normalizedLinkText = normalizeLink(linkText);
    setLink(editor, normalizedLinkText);
    setLinkText("");
    setShowLinkInput(false);
  };

  const handleRemoveLink = () => {
    setLink(editor, false);
    setLinkText("");
    setShowLinkInput(false);
  };

  const getLink = () => {
    const currentLink = getActiveMark(editor, "link");
    if (currentLink) setLinkText(currentLink);
    else setLinkText("");
  };

  const handleLinkIconClick = () => {
    getLink();
    setShowLinkInput(!showLinkInput);
  };

  useEffect(() => {
    if (!editor) return;
    getLink();
  }, [editor]);

  return (
    <div className={styles.toolbarFlexWrapper}>
      <button className="buttonMain" onClick={handleLinkIconClick}>
        <FaLink />
      </button>
      {showLinkInput && (
        <div className={styles.linkDropdownContainer}>
          {/* <div
            style={{
              position: "absolute",
              top: "5rem",
              display: "flex",
              transform: "translateX(-35%)",
            }}
          > */}
          <input
            className="inputMain"
            value={linkText}
            placeholder="Your Link Here"
            onChange={(e) => setLinkText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommitLink}
            style={{ width: "20rem" }}
          />
            <button className="buttonMain" style={{margin: 'auto 0.5rem'}} onClick={handleCommitLink}>
              +
            </button>

            <button className="buttonMain" onClick={handleRemoveLink}>
              -
            </button>
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default Links;
