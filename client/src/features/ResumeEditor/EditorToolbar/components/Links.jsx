import React, { useState } from "react";
import TextFormatButton from "../../TextFormatting/shared/TextFormatButton";
import { setLink } from "@/helpers/marks";
import TextFormatInput from "../../TextFormatting/shared/TextFormatInput";

const Links = ({ editor }) => {
  const [linkText, setLinkText] = useState("");

  const handleCommitLink = () => {
    setLink(editor, linkText);
    setLinkText('');
  }

  return (
    <div>
      <TextFormatInput value={linkText} handleChange={setLinkText} commitChange={handleCommitLink} />
      <TextFormatButton text="Add Link" command={handleCommitLink} />
      

      <TextFormatButton
        text="Remove Link"
        command={() => setLink(editor, false)}
      />
    </div>
  );
};

export default Links;
