import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import { selectFilteredLanguages } from './store/languagesSlice';

function LanguagesHeader({ canManage }) {
  const filteredData = useSelector(selectFilteredLanguages);
  const { t } = useTranslation('navigation');
  const languageSteps = [
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('LANGUAGE') }),
    },
  ];

  return (
    <HeaderContent
      id="addLanguage"
      steps={languageSteps}
      instruction={t('INSTRUCTION', { name: t('LANGUAGES').toLowerCase() })}
      name="LANGUAGES"
      data={filteredData}
      addButtonTo="new/edit"
      disableAddButton={!canManage}
      disableSearch
      disableLanguageSwitcher
    />
  );
}

export default LanguagesHeader;
