import SlateField from "./SlateField";

const MainSlate = ({ section }) => {
  const { id, data } = section;

  if (!data || !data.subsections) return null; // <-- prevents early render

  return (
    <div>
      <div style={data.styling}>{data.sectionTitle}</div>

      {data.subsections.map((sub) => (
        <div key={sub.id} style={sub.styling}>
          {sub.fields.map((field) => (
            <SlateField
              key={field.id}
              field={field}
              sectionId={id}
              subsectionId={sub.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MainSlate;