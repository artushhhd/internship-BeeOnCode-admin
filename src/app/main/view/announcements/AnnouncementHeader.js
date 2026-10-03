import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import { selectFilteredAnnouncements } from './store/announcementsSlice';

function AnnouncementHeader({ canManage }) {
  const filteredData = useSelector(selectFilteredAnnouncements);
  const { t } = useTranslation('navigation');

  const AnnouncmentSteps = [
    {
      element: '#addLAnnouncement',
      // add language
      intro: t('ADDSTEP', { name: t('ANNOUNCEMENT') }),
    },
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('ANNOUNCEMENT') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('ANNOUNCEMENT') }),
    },
    {
      element: '#four',
      intro: t('EYE_VIEW', { name: t('ANNOUNCEMENT') }),
    },
  ];
  const AnnouncementStepsWithoutthem = [
    {
      element: '#addLAnnouncement',
      // add
      intro: t('ADDSTEP', { name: t('ANNOUNCEMENT') }),
    },
    {
      element: '#two',
      // exam setting
      intro: t('NO_SMB', { name: t('ANNOUNCEMENT') }),
    },
  ];
  return (
    <HeaderContent
      id="addLAnnouncement"
      steps={filteredData?.length > 0 ? AnnouncmentSteps : AnnouncementStepsWithoutthem}
      instruction={t('INSTRUCTION', { name: t('ANNOUNCEMENT').toLowerCase() })}
      name="ANNOUNCEMENT"
      data={filteredData}
      addButtonTo="new/edit"
      disableAddButton={!canManage}
      disableSearch
    />
  );
}

export default AnnouncementHeader;
