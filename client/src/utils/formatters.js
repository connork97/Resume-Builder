export const formatDateTime = (dateTimeValue) => {
  if (!dateTimeValue) return '';

  const date = new Date(dateTimeValue);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};

export const parseRemValue = (value) => {
      const parsedValue = parseFloat(String(value ?? '0rem').replace('rem', ''));
      return Number.isNaN(parsedValue) ? 0 : parsedValue;
   };