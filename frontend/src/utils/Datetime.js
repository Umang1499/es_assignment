export const getCurrentTimestamp = () => Math.ceil(Date.now() / 1000);

export const convertDbDateStringToDisplayDateString = (dateString) => {
  const [year, month, day] = dateString.split('T')[0].split('-');

  const displayDateString = `${month}/${day}/${year}`;

  return displayDateString;
};
