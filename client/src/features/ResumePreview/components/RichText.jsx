import {
  getCascadedFontSize,
  getCascadedLineHeight,
} from "@/helpers/leafHelpers";
import { ICONS_MAP } from "@/lib/iconLibrary";

const typography = (styling) => ({
  fontSize: `${getCascadedFontSize(styling)}px`,
  lineHeight: getCascadedLineHeight(styling),
});

// Saved Slate nodes become plain HTML; no editor, store, or drag handlers.
export default function RichText({ value, styling, gap }) {
  const renderNode = (node, index) => {
    if (typeof node.text === "string") {
      let text = node.text;
      if (node.bold) text = <strong>{text}</strong>;
      if (node.italic) text = <em>{text}</em>;
      if (node.underline) text = <u>{text}</u>;
      if (node.strikeThrough) text = <s>{text}</s>;
      // Preserve link styling without introducing a navigation target.
      if (node.link)
        text = (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25em",
            }}
          >
            {text}
          </span>
        );
      return (
        <span
          key={index}
          style={{
            ...typography({ ...styling, leafStyling: node }),
            color: node.color,
            backgroundColor: node.highlightColor,
          }}
        >
          {text}
        </span>
      );
    }
    if (node.type === "icon") {
      const Icon = ICONS_MAP[node.iconId];
      return (
        <span
          key={index}
          style={{
            display: "inline-block",
            verticalAlign: "bottom",
            lineHeight: 1,
            color: node.iconColor ?? "currentColor",
            fontSize: `${getCascadedFontSize(styling) + (node.children?.[0]?.fontSizeOffset ?? 0)}px`,
          }}
        >
          {Icon && <Icon aria-hidden="true" focusable="false" />}
        </span>
      );
    }
    const Tag =
      {
        "unordered-list": "ul",
        "ordered-list": "ol",
        "list-item": "li",
        heading: "h2",
      }[node.type] || "p";
    const empty = node.children?.length === 1 && node.children[0].text === "";
    return (
      <Tag
        key={index}
        style={{
          textAlign: node.textAlign,
          ...((Tag === "ul" || Tag === "ol") && {
            paddingLeft: "var(--list-padding-left-default)",
          }),
          ...(Tag === "li" && { marginBottom: gap?.field || "0rem" }),
        }}
      >
        {empty ? <br /> : node.children?.map(renderNode)}
      </Tag>
    );
  };
  return (
    <div
      style={{
        ...typography(styling),
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
      }}
    >
      {value?.map(renderNode)}
    </div>
  );
}
