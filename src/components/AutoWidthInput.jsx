import { useRef, useEffect } from "react";

const AutoWidthInput = ({ value, placeholder, className, onChange }) => {
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      spanRef.current.textContent = value || placeholder || "";
      const width = spanRef.current.offsetWidth + 2; // small buffer
      inputRef.current.style.width = width + "px";
    }
  }, [value, placeholder]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          font: "inherit",
          padding: "0",
        }}
      />
      <input
        ref={inputRef}
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "auto",
          minWidth: "1ch",
          boxSizing: "content-box",
          ...((value.length || placeholder.length) && {borderBottom: 'none'})
        }}
      />
    </div>
  );
};

export default AutoWidthInput;