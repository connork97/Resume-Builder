import React, { useState } from "react";
import TextFormatButton from "./shared/TextFormatButton";
import { setLink } from "@/helpers/marks";
import TextFormatInput from "./shared/TextFormatInput";
import styles from "./TextFormatting.module.css";

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

  const handleCommitLink = () => {
    const normalizedLinkText = normalizeLink(linkText);
    setLink(editor, normalizedLinkText);
    setLinkText("");
  };

  return (
    <div className={styles.toolbarFlexWrapper}>
      <TextFormatInput
        value={linkText}
        placeholder="Your Link Here"
        handleChange={setLinkText}
        commitChange={handleCommitLink}
        styling={{ width: "10rem" }}
      />
      <TextFormatButton text="+" command={handleCommitLink} />

      <TextFormatButton text="-" command={() => setLink(editor, false)} />
    </div>
  );
};

export default Links;
