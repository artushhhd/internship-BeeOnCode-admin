import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import TabSection from '../../pageSections/itemSections/TabSection';
import { changeOrderTabs } from '../../store/pageSectionSlice';

const TabForm = ({ control, section, edit, reset, handleSubmit, errors }) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  useEffect(() => {
    if (section) {
      if (section.type === 'tab') {
        if (edit) {
          section.translations.forEach((item) => {
            copySection[`title${item.language_id}`] = item.title;
          });
        } else {
          translationLanguages.forEach((language) => {
            copySection[`title${language.id}`] = '';
          });
        }
      }

      reset({ ...copySection });
    }
  }, [section, copySection, edit, reset, translationLanguages, handleSubmit]);

  return (
    <div className={edit ? 'p-24 ' : undefined}>
      <InputTranslationController control={control} errors={errors} name="title" />

      {section.tabs?.length && (
        <DragAndDrop data={section.tabs} direction="horizontal" update={changeOrderTabs}>
          <TabSection />
        </DragAndDrop>
      )}
    </div>
  );
};

export default TabForm;
