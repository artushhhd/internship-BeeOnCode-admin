import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';

function TranslationsHeader() {
  const { t } = useTranslation('navigation');
  const StepSteps = [
    {
      element: '#two',
      intro: t('VIEWSTEP', { name: t('TRANSLATIONS') }),
    },
  ];
  return (
    <HeaderContent
      id="stepadd"
      steps={StepSteps}
      instruction={t('INSTRUCTION2', { name: t('TRANSLATIONS').toLowerCase() })}
      name="TRANSLATIONS"
      disableLanguageSwitcher
      disableAddButton
      disableSearch
    />
  );
}

export default TranslationsHeader;
