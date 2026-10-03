const createTreeViewData = (data, language = 1, depth = 0) => {
  data.forEach((item) => {
    item.depth = depth;
    item.title = item.translations.find((t) => t.language_id === language)
      ? item.translations.find((t) => t.language_id === language).name
      : item.translations[0].name;
    item.isDirectory = true;
    item.expanded = false;
    if (item.children.length > 0) {
      createTreeViewData(item.children, language, depth + 1);
    }
  });
  return data;
};

export default createTreeViewData;
