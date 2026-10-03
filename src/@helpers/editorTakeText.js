export default function getPlain(editorText) {
  const textObj = {};
  let newText = [];
  Object.keys(editorText).forEach((key) => {
    newText = editorText[key].editorState.blocks;
    newText?.map(({ text }) => {
      // eslint-disable-next-line no-return-assign
      return (textObj[key] = text);
    });
  });
  return textObj;
}
