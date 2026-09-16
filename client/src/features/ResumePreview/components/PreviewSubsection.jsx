import PreviewField from "./PreviewField";

export default function PreviewSubsection({
  subsection,
  section,
  resume,
  styling,
  isLast,
}) {
  const layout = subsection.layout || {};
  const sectionLayout = section.layout || {};
  const isGrid = sectionLayout.display === "grid";
  const columns = Math.max(1, Number(sectionLayout.grid?.columns) || 1);
  const parentStyle = isGrid
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }
    : {
        display: layout.display || sectionLayout.display || "flex",
        flexWrap: "wrap",
        flexDirection:
          layout.flexDirection || sectionLayout.flexDirection || "column",
        justifyContent:
          layout.justifyContent ||
          sectionLayout.justifyContent ||
          "space-between",
        justifySelf: layout.justifySelf,
        gap: layout.gap,
      };
  const fields = subsection.fieldIds
    .map((id) => resume.fields.byId[id])
    .filter(Boolean);
  return (
    <div
      style={{
        ...parentStyle,
        position: "relative",
        boxSizing: "border-box",
        marginBottom: isLast ? 0 : resume.layout.gap?.subsection || 0,
      }}
    >
      {fields.map((field, index) => {
        let currentColumn = 1;
        for (let previous = 0; previous < index; previous += 1) {
          currentColumn =
            fields[previous + 1].layout?.startNewRow || currentColumn >= columns
              ? 1
              : currentColumn + 1;
        }
        const onlyItem =
          currentColumn === 1 &&
          (!fields[index + 1] || fields[index + 1].layout?.startNewRow);
        return (
          <PreviewField
            key={field.id}
            field={field}
            styling={{ ...styling, subsectionStyling: subsection.styling }}
            gap={resume.layout.gap}
            isGrid={isGrid}
            columns={columns}
            isOnlyItemInRow={onlyItem}
            isLast={index === fields.length - 1}
          />
        );
      })}
    </div>
  );
}
