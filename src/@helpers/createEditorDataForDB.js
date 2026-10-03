const createEditorDataForDB = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key] = JSON.stringify(obj[key]);
  });
  return newObj;
};

export default createEditorDataForDB;
