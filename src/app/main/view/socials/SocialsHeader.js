import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import { selectFilteredSocials } from './store/socialsSlice';

function SocialsHeader(props) {
  const filteredData = useSelector(selectFilteredSocials);
  const { t } = useTranslation('navigation');

  const SocialsSteps = [
    {
      element: '#one',
      intro: t('VIEWSTEP', { name: t('SOCIALNETWORKS') }),
    },
    {
      element: '#two',
      intro: t('EYE_VIEW', { name: t('SOCIALNETWORKS') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('SOCIALNETWORKS') }),
    },
  ];
  return (
    <HeaderContent
      steps={SocialsSteps}
      instruction={t('SOCIALNETWORKS_INSTRUCTION')}
      name="SOCIALNETWORKS"
      data={filteredData}
      addButtonTo=""
      disableSearch
      disableLanguageSwitcher
    />
  );
}

export default SocialsHeader;
