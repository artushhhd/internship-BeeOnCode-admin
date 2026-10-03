import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import { selectFilteredServices } from './store/servicesSlice';

function ServicesHeader({ canManage }) {
  const filteredData = useSelector(selectFilteredServices);
  const { t } = useTranslation('navigation');

  const servicesSteps = [
    {
      element: '#servicesAdd',
      // add service
      intro: t('ADDSTEP', { name: t('SERVICES') }),
    },
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('SERVICES') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('SERVICES') }),
    },
    {
      element: '#four',
      intro: t('EYE_VIEW', { name: t('SERVICES') }),
    },
  ];
  const servicesStepsWithoutItems = [
    {
      element: '#servicesAdd',
      // add
      intro: t('ADDSTEP', { name: t('SERVICES') }),
    },
    {
      element: '#two',
      // empty list
      intro: t('NO_SMB', { name: t('SERVICES') }),
    },
  ];
  return (
    <HeaderContent
      id="servicesAdd"
      steps={filteredData?.length > 0 ? servicesSteps : servicesStepsWithoutItems}
      instruction={t('INSTRUCTION', { name: t('SERVICES').toLowerCase() })}
      name="SERVICES"
      data={filteredData}
      addButtonTo="new/edit"
      disableAddButton={!canManage}
      disableSearch
    />
  );
}

export default ServicesHeader;
