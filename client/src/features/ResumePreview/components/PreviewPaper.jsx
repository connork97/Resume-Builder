import PreviewColumn from "./PreviewColumn";

export default function PreviewPaper({ resume }) {
  const columns = resume.columns.allIds
    .map((id) => resume.columns.byId[id])
    .filter(Boolean);

  return columns.map((column, index) => (
    <PreviewColumn
      key={column.id}
      column={column}
      resume={resume}
      isFirstColumn={index === 0}
      isLastColumn={index === columns.length - 1}
    />
  ));
}
