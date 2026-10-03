const FixDate = (data) => {
  const date = new Date(data);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString();
};

export default FixDate;
