import RichText from "./RichText";

export default function PreviewField({
  field,
  styling,
  gap,
  isGrid,
  columns,
  isOnlyItemInRow,
  isLast,
}) {
  const span = isOnlyItemInRow && field.layout?.grid?.fillRow;

  return (
    <div
      style={{
        position: "relative",
        ...(isGrid && {
          gridColumnStart: field.layout?.startNewRow ? 1 : "auto",
          gridColumnEnd: span ? `span ${columns}` : "auto",
        }),
        marginBottom: isLast ? 0 : gap?.field || 0,
        textAlign: field.textAlign,
      }}
    >
      <RichText
        value={field.value}
        styling={{ ...styling, fieldStyling: field.styling }}
        gap={gap}
      />
    </div>
  );
}
