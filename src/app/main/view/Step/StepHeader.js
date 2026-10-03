import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';

function StepHeader({ canManage }) {
  // const { Step } = useSelector((state) => state.SecondaryMenusApp.secondaryMenuReducer);

  const { t } = useTranslation('navigation');
  const StepSteps = [
    {
      element: '#stepadd',
      intro: t('ADDSTEP', { name: t('STEP') }),
    },
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('STEP') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('STEP') }),
    },
  ];
  return (
    <HeaderContent
      id="stepadd"
      steps={StepSteps}
      instruction={t('INSTRUCTION', { name: t('STEP').toLowerCase() })}
      name="STEP"
      addButtonTo="new/edit"
      disableAddButton={!canManage}
      disableSearch
    />
  );
}

export default StepHeader;
