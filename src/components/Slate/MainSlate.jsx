import SlateField from "./SlateField";

const MainSlate = ({ id, data }) => {

  return (
    <div>
      <div style={{ ...data.styling }}>{data.sectionTitle}</div>

      {data.subsections.map((sub) =>
        sub.fields.map((field) => (
          <SlateField
            key={field.id}
            field={field}
            sectionId={id}
            subsectionId={sub.id}
          />
        ))
      )}
    </div>
  );
};

export default MainSlate;