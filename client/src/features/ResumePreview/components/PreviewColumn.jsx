import PreviewSection from "./PreviewSection";

export default function PreviewColumn({ column, resume, isFirstColumn, isLastColumn }) {
  const sections = column.sectionIds
    .map((id) => resume.sections.byId[id])
    .filter(Boolean);

  return (
    <div
      style={{
        height: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        flex:
          column.layout?.width?.auto || !column.layout?.width?.value
            ? "1 1 0%"
            : `0 0 ${column.layout.width.value}`,
      }}
    >
      {sections.map((section, index) => (
        <PreviewSection
          key={section.id}
          section={section}
          column={column}
          resume={resume}
          isFirstColumn={isFirstColumn}
          isLastColumn={isLastColumn}
          isFirstSection={index === 0}
          isLastSection={index === sections.length - 1}
        />
      ))}
    </div>
  );
}
