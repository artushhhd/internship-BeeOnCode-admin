function createArrayTranslationData(languages, keys) {
  return languages.reduce((acc, language) => {
    const langId = language?.index + 1;
    const matchingKeys = keys.filter((key) => key?.language_id === langId).map((key) => key?.name);

    acc[langId] = matchingKeys;
    return acc;
  }, {});
}

export default createArrayTranslationData;
