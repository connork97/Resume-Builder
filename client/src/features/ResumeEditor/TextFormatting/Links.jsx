import React, { useEffect, useState } from "react";
import TextFormatButton from "./shared/TextFormatButton";
import { getActiveMark, setLink } from "@/helpers/marks";
import TextFormatInput from "./shared/TextFormatInput";
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
    setShowLinkInput(false)
  }

  const getLink = () => {
    // try {
      const currentLink = getActiveMark(editor, 'link');
      if (currentLink) setLinkText(currentLink)
      else setLinkText("")
    // }
    // catch {setLinkText("")}
  }

  const handleLinkIconClick = () => {
    getLink();
    setShowLinkInput(!showLinkInput);
  }

  useEffect(() => {
    if (!editor) return;
    getLink()
  }, [editor])

  return (
    <div className={styles.toolbarFlexWrapper}>
      <TextFormatButton
        icon={<FaLink style={{ height: "1.25rem" }} />}
        command={handleLinkIconClick}
      />
      {showLinkInput && (
        <div style={{position: 'absolute', top: '5rem', display: 'flex', transform: 'translateX(-35%)'}}>
          <TextFormatInput
            value={linkText}
            placeholder="Your Link Here"
            handleChange={setLinkText}
            commitChange={handleCommitLink}
            styling={{ width: "15rem", backgroundColor: 'var(--background-toolbar)' }}
          />
          <TextFormatButton text="+" command={handleCommitLink} styling={{backgroundColor: 'var(--background-toolbar)'}} />

          <TextFormatButton text="-" command={handleRemoveLink} styling={{backgroundColor: 'var(--background-toolbar)'}} />
        </div>
      )}
    </div>
  );
};

export default Links;
