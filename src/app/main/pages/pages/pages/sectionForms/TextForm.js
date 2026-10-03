import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import Box from '@mui/system/Box';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';

const TextForm = ({ reset, handleSubmit, control, setEditorData, edit, errors, section }) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  useEffect(() => {
    if (section) {
      if (section.type === 'text') {
        if (edit) {
          section.translations.forEach((item) => {
            copySection[`title${item.language_id}`] = item.title;
          });
          section.text.translations.forEach((item) => {
            copySection[`content${item.language_id}`] = item.text
              ? JSON.parse(item.text).htmlValue
              : '';
          });
        } else {
          translationLanguages.forEach((language) => {
            copySection[`title${language.id}`] = '';
          });

          translationLanguages.forEach((language) => {
            copySection[`content${language.id}`] = '';
          });
        }
      }

      reset({ ...copySection });
    }
  }, [section, copySection, edit, reset, translationLanguages, handleSubmit]);

  return (
    <Box className={edit ? 'p-24' : undefined}>
      <div className="w-full">
        <InputTranslationController control={control} name="title" errors={errors} />
        <EditorTranslationController
          control={control}
          name="content"
          setEditorData={setEditorData}
        />
      </div>
    </Box>
  );
};

export default TextForm;
