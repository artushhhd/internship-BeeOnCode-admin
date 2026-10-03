const EditorText = ({ text, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: text ? JSON.parse(text).htmlValue : null }}
    />
  );
};

export default EditorText;
