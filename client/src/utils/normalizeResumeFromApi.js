// * ------------------------------ V
// * API TO FRONT END NORMALIZATION V
// * ------------------------------ V

import BackgroundColor from "../pages/Editor/Formatting/BackgroundColor";

const normalizeResumeFromApi = (apiResume) => {
  const normalizedResume = {
    id: apiResume.id ?? null,
    title: apiResume.title ?? '',
    userId: apiResume.userId ?? null,

    columns: {
      byId: {},
      allIds: [],
    },

    sections: {
      byId: {},
      allIds: [],
    },

    subsections: {
      byId: {},
      allIds: [],
    },

    fields: {
      byId: {},
      allIds: [],
    },

    styling: apiResume.styling ?? {backgroundColor: 'rgba(255, 255, 255, 1)'},
    layout: apiResume.layout ?? {},

    activeSectionId: null,
    activeEditorId: null,
    activeEditorSelection: null,
  };

  const sortedColumns = [...(apiResume.columns ?? [])].sort(
    (a, b) => a.position - b.position
  );

  sortedColumns.forEach((column) => {
    const sortedSections = [...(column.sections ?? [])].sort(
      (a, b) => a.position - b.position
    );

    normalizedResume.columns.byId[column.id] = {
      id: column.id,
      resumeId: column.resumeId,
      width: column.width ?? '100%',
      position: column.position ?? 0,
      sectionIds: sortedSections.map((section) => section.id),
    };

    normalizedResume.columns.allIds.push(column.id);

    sortedSections.forEach((section) => {
      const sortedSubsections = [...(section.subsections ?? [])].sort(
        (a, b) => a.position - b.position
      );

      normalizedResume.sections.byId[section.id] = {
        id: section.id,
        columnId: section.columnId,
        label: section.label ?? '',
        type: section.type ?? 'defaultSection',
        position: section.position ?? 0,
        value: section.value ?? [],
        styling: section.styling ?? {},
        subsectionIds: sortedSubsections.map((subsection) => subsection.id),
      };

      normalizedResume.sections.allIds.push(section.id);

      sortedSubsections.forEach((subsection) => {
        const sortedFields = [...(subsection.fields ?? [])].sort(
          (a, b) => a.position - b.position
        );

        normalizedResume.subsections.byId[subsection.id] = {
          id: subsection.id,
          sectionId: subsection.sectionId,
          label: subsection.label ?? '',
          type: subsection.type ?? 'default',
          position: subsection.position ?? 0,
          styling: subsection.styling ?? {},
          fieldIds: sortedFields.map((field) => field.id),
        };

        normalizedResume.subsections.allIds.push(subsection.id);

        sortedFields.forEach((field) => {
          normalizedResume.fields.byId[field.id] = {
            id: field.id,
            subsectionId: field.subsectionId,
            label: field.label ?? '',
            position: field.position ?? 0,
            value: field.value ?? [],
            styling: field.styling ?? {},
          };

          normalizedResume.fields.allIds.push(field.id);
        });
      });
    });
  });
  
  // const apiColumns = apiResume.columns;

  // apiColumns.forEach((column) => {
  //   const apiSections = column.sections;

  //   normalizedResume.columns.byId[column.id] = {
  //     id: column.id,
  //     resumeId: column.resumeId,
  //     width: column.width ?? '100%',
  //     position: column.position ?? 0,
  //     sectionIds: apiSections.map((section) => section.id)
  //   };

  //   normalizedResume.columns.allIds.push(column.id);

  //   apiSections.forEach((section) => {
  //     const apiSubsections = section.subsections;

  //     normalizedResume.sections.byId[section.id] = {
  //       id: section.id,
  //       columnId: section.columnId,
  //       label: section.label ?? '',
  //       type: section.type ?? 'defaultSection',
  //       position: section.position ?? 0,
  //       value: section.value ?? [],
  //       styling: section.styling ?? {},
  //       subsectionIds: apiSubsections.map((subsection) => subsection.id)
  //     }

  //     normalizedResume.sections.allIds.push(section.id);

  //     apiSubsections.forEach((subsection) => {
  //       const apiFields = subsection.fields;

  //       normalizedResume.subsections.byId[subsection.id] = {
  //         id: subsection.id,
  //         sectionId: subsection.sectionId,
  //         label: subsection.label ?? '',
  //         type: subsection.type ?? 'default',
  //         position: subsection.position ?? 0,
  //         styling: subsection.styling ?? {},
  //         fieldIds: apiFields.map((field) => field.id),
  //       };

  //       normalizedResume.subsections.allIds.push(subsection.id);

  //       apiFields.forEach((field) => {
  //         normalizedResume.fields.byId[field.id] = {
  //           id: field.id,
  //           subsectionId: field.subsectionId,
  //           label: field.label ?? '',
  //           position: field.position ?? 0,
  //           value: field.value ?? [],
  //           styling: field.styling ?? {},
  //         };

  //         normalizedResume.fields.allIds.push(field.id);
  //       })
  //     });
  //   });
  // });

  return normalizedResume;
};

export default normalizeResumeFromApi;