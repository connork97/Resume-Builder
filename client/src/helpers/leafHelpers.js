export const getPxNumber = (value, fallback = 12) => {
  if (value === undefined || value === null) return fallback;

  const number = Number(String(value).replace(/[^0-9.]/g, ''));

  return Number.isNaN(number) ? fallback : number;
};

export const getNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;

  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};

export const roundToTenth = (value) => Number(getNumber(value, 0).toFixed(1));

export const getCascadedFontSize = ({
  resumeStyling,
  columnStyling = {},
  sectionStyling = {},
  subsectionStyling = {},
  fieldStyling = {},
  leafStyling = {},
}) => {
  const resumeFontSize = getPxNumber(resumeStyling?.fontSize);
  const columnFontSizeOffset = columnStyling?.fontSizeOffset ?? 0;
  const sectionFontSizeOffset = sectionStyling?.fontSizeOffset ?? 0;
  const subsectionFontSizeOffset = subsectionStyling?.fontSizeOffset ?? 0;
  const fieldFontSizeOffset = fieldStyling?.fontSizeOffset ?? 0;
  const leafFontSizeOffset = leafStyling?.fontSizeOffset ?? 0;

  return resumeFontSize + columnFontSizeOffset + sectionFontSizeOffset + subsectionFontSizeOffset + fieldFontSizeOffset + leafFontSizeOffset;
};

export const getCascadedLineHeight = ({
  resumeStyling,
  columnStyling = {},
  sectionStyling = {},
  subsectionStyling = {},
  fieldStyling = {},
  leafStyling = {},
}) => {
  const resumeLineHeight = getNumber(resumeStyling?.lineHeight, 1.2);
  const columnLineHeightOffset = getNumber(columnStyling?.lineHeightOffset, 0);
  const sectionLineHeightOffset = getNumber(sectionStyling?.lineHeightOffset, 0);
  const subsectionLineHeightOffset = getNumber(subsectionStyling?.lineHeightOffset, 0);
  const fieldLineHeightOffset = getNumber(fieldStyling?.lineHeightOffset, 0);
  const leafLineHeightOffset = getNumber(leafStyling?.lineHeightOffset, 0);

  return roundToTenth(
    resumeLineHeight +
    columnLineHeightOffset +
    sectionLineHeightOffset +
    subsectionLineHeightOffset +
    fieldLineHeightOffset +
    leafLineHeightOffset
  );
};