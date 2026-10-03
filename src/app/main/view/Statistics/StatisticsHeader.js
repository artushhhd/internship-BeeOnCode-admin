import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';

function StatisticsHeader({ canManage }) {
  // const { Step } = useSelector((state) => state.SecondaryMenusApp.secondaryMenuReducer);

  const { t } = useTranslation('navigation');
  const statisticStep = [
    {
      element: '#statisticAdd',
      // add language
      intro: t('ADDSTEP', { name: t('STATISTICS') }),
    },
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('STATISTICS') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('STATISTICS') }),
    },
    {
      element: '#four',
      intro: t('EYE_VIEW', { name: t('STATISTICS') }),
    },
  ];

  return (
    <HeaderContent
      id="statisticAdd"
      steps={statisticStep}
      instruction={t('INSTRUCTION', { name: t('STATISTICS').toLowerCase() })}
      name="STATISTICS"
      // data={Step}
      addButtonTo="new/edit"
      disableAddButton={!canManage}
      disableSearch
    />
  );
}

export default StatisticsHeader;
