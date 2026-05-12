const COLOR_KEYS = [
  "color",
  "backgroundColor",
  "background",
  "borderColor",
  "textColor",
  "fontColor"
];

const collectColorsFromStyle = (styling = {}, colors = new Set()) => {
  for (const key of COLOR_KEYS) {
    if (styling[key]) {
      colors.add(styling[key]);
    }
  }
};

const collectColorsFromSlateNodes = (nodes = [], colors = new Set()) => {
  if (!Array.isArray(nodes)) return colors;

  nodes.forEach(node => {
    if (node.color) {
      colors.add(node.color);
    }

    if (node.backgroundColor) {
      colors.add(node.backgroundColor);
    }

    if (Array.isArray(node.children)) {
      collectColorsFromSlateNodes(node.children, colors);
    }
  });

  return colors;
};

export const selectUsedResumeColors = (state) => {
  const resume = state.resume;
  const colors = new Set();

  collectColorsFromStyle(resume.styling, colors);
  

  Object.values(resume.columns.byId).forEach(column => {
    collectColorsFromStyle(column.styling, colors);
  });

  Object.values(resume.sections.byId).forEach(section => {
    collectColorsFromStyle(section.styling, colors);
    collectColorsFromSlateNodes(section.value, colors);
  });

  Object.values(resume.subsections.byId).forEach(subsection => {
    collectColorsFromStyle(subsection.styling, colors);
  });

  Object.values(resume.fields.byId).forEach(field => {
    collectColorsFromStyle(field.styling, colors);
    collectColorsFromSlateNodes(field.value, colors);
  });

  return [...colors];
};