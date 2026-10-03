const createTranslationData = (data, string, nullable = false) => {
  const obj = {};
  obj[string] = {};
  Object.entries(data).forEach(([key, value]) => {
    if (key.includes(string)) {
      const ret = key.replace(string, '');
      const res = +ret;
      if (value) {
        obj[string][res] = value;
      } else if (!nullable) {
        obj[string][res] = '';
      }
    }
  });
  return obj[string];
};

export default createTranslationData;
