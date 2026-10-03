import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';

function FileManagerHeader(props) {
  const { t } = useTranslation('navigation');

  const fileSteps = [
    {
      element: '#one',
      // add
      intro: t('ADDSTEP', { name: t('FILE') }),
    },
    {
      element: '#two',
      // filter
      intro: t('FILTER_STEP', { name: t('FILE') }),
    },
    {
      element: '#three',
      intro: `${t('VIEWSTEP', { name: t('FILES') })} `,
    },
    {
      element: '#four',
      intro: t('FOLDER_STEP'),
    },
    {
      element: '#five',
      intro: t('QUESTIONSTEP5', { name: t('PROJECT') }),
    },
  ];

  return (
    <HeaderContent
      steps={fileSteps}
      instruction={t('FILEMANAGER_INSTRUCTION')}
      name="FILEMANAGER"
      addButtonTo=""
      disableSearch
      disableLanguageSwitcher
    />
  );
}

export default FileManagerHeader;
