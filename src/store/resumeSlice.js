import { createSlice, nanoid } from "@reduxjs/toolkit";

// Default Data for Brand New Section
const createDefaultData = (type) => {
  switch (type) {
    case "header":
      return {
        sectionTitle: "Header",
        subsections: [
          {
            id: nanoid(),
            fields: [
              { id: nanoid(), key: "name", label: "Name", value: "" },
              { id: nanoid(), key: "title", label: "Title", value: "" }
            ]
          }
        ]
      };

    case "contact":
      return {
        sectionTitle: "Contact",
        subsections: [
          {
            id: nanoid(),
            fields: [
              { id: nanoid(), key: "value", label: "Email", value: "" },
              { id: nanoid(), key: "value", label: "Phone", value: "" },
              { id: nanoid(), key: "value", label: "Location", value: "" },
              { id: nanoid(), key: "value", label: "Website", value: "" },
              { id: nanoid(), key: "value", label: "LinkedIn", value: "" }
            ]
          },
        ]
      };

    case "summary":
      return {
        sectionTitle: "Summary",
        subsections: [
          {
            id: nanoid(),
            fields: [
              { id: nanoid(), key: "content", label: "Summary", value: "" }
            ]
          }
        ]
      };

    case "skills":
      return {
        sectionTitle: "Skills",
        subsections: []
      };

    case "workHistory":
      return {
        sectionTitle: "Work History",
        subsections: []
      };

    case "education":
      return {
        sectionTitle: "Education",
        subsections: []
      };

    default:
      return {};
  }
};

// Default Subsection Fields (for Initial AND Additional Subsections)
const createDefaultSubsection = (type) => {
  switch (type) {
    case "header":
      return {
        sectionTitle: "Header",
        fields: [
          { id: nanoid(), key: "name", label: "Name", value: "" },
          { id: nanoid(), key: "title", label: "Title", value: "" }
        ]
      };

    case "workHistory":
      return {
        fields: [
          { id: nanoid(), key: "jobTitle", label: "Job Title", value: "" },
          { id: nanoid(), key: "company", label: "Company", value: "" },
          { id: nanoid(), key: "location", label: "Location", value: "" },
          { id: nanoid(), key: "startDate", label: "Start Date", value: "" },
          { id: nanoid(), key: "endDate", label: "End Date", value: "" },
          { id: nanoid(), key: "description", label: "Description", value: "" }
        ]
      };

    case "education":
      return {
        fields: [
          { id: nanoid(), key: "school", label: "School", value: "" },
          { id: nanoid(), key: "degree", label: "Degree", value: "" },
          { id: nanoid(), key: "field", label: "Field of Study", value: "" },
          { id: nanoid(), key: "location", label: "Location", value: "" },
          { id: nanoid(), key: "startDate", label: "Start Date", value: "" },
          { id: nanoid(), key: "endDate", label: "End Date", value: "" },
          { id: nanoid(), key: "description", label: "Description", value: "" }
        ]
      };

    case "skills":
      return {
        fields: [
          { id: nanoid(), key: "skill", label: "Skill", value: "" }
        ]
      };

    case "contact":
      return {
        fields: [
          { id: nanoid(), key: "value", label: "New Contact Item", value: "" },
          // { id: nanoid(), key: "value", label: "Value", value: "" }
        ]
      };
    
    case "summary":
      return {
        fields: [
          { id: nanoid(), key: "content", label: "Summary", value: "" }
        ]
      };

    default:
      return { fields: [] };
  }
};

// Resume Slice

const initialState = {
  sections: []
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    addSection: {
      reducer(state, action) {
        state.sections.push(action.payload);
      },
      prepare(type, columnIndex = 0) {
        const baseData = createDefaultData(type);

        let data = { ...baseData };

        // If the section type uses subsections but has none, create the first one
        if (Array.isArray(baseData.subsections) && baseData.subsections.length === 0) {
          data = {
            ...baseData,
            subsections: [
              {
                id: nanoid(),
                ...createDefaultSubsection(type)
              }
            ]
          };
        }

        return {
          payload: {
            id: nanoid(),
            type,
            columnIndex,
            data
          }
        };
      }
    },

    updateSection(state, action) {
      const { id, changes } = action.payload;
      const section = state.sections.find((s) => s.id === id);
      if (section) Object.assign(section, changes);
    },

    deleteSection(state, action) {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
    },

    reorderSections(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, moved);
    },

    addSubsection(state, action) {
      const { sectionId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const type = section.type;

      if (!Array.isArray(section.data.subsections)) {
        section.data.subsections = [];
      }

      section.data.subsections.push({
        id: nanoid(),
        // ...subsectionData
        ...createDefaultSubsection(type)

      });
    },

    deleteSubsection(state, action) {
      const { sectionId, subsectionId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section || !Array.isArray(section.data.subsections)) return;

      section.data.subsections = section.data.subsections.filter(
        (sub) => sub.id !== subsectionId
      );
    },

    reorderSubsections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section || !Array.isArray(section.data.subsections)) return;

      const arr = section.data.subsections;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },

    //  Add field to a subsection
    addField(state, action) {
      const { sectionId, subsectionId, fieldData } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields.push({
        id: nanoid(),
        ...fieldData
      });

    },

    //  Update a field in a subsection
    updateField(state, action) {
      const { sectionId, subsectionId, fieldId, newValue } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const field = subsection.fields.find((f) => f.id === fieldId);
      if (field) field.value = newValue;
    },

    //  Delete a field in a subsection
    deleteField(state, action) {
      const { sectionId, subsectionId, fieldId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
    },

    //  Reorder fields in a subsection
    reorderFields(state, action) {
      const { sectionId, subsectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const arr = subsection.fields;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    }
  }
});

export const {
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  updateField,
  deleteField,
  reorderFields
} = resumeSlice.actions;

export default resumeSlice.reducer;