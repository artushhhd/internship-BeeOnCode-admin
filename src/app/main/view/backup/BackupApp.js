import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from './store';
import BackupList from './backupList';
import Error404Page from '../../404/Error404Page';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';
import { getBackup } from './store/backupSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function BackupApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const { backup } = useSelector((state) => state.BackupApp.backupReducer);

  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useDeepCompareEffect(() => {
    dispatch(getBackup());
  }, [dispatch]);
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  const [search, setSearch] = useState('');
  const [searchedState, setSearchedState] = useState([]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'BACKUPES' }));
    if (backup?.backups?.length) {
      setSearchedState(backup?.backups);
    }
  }, [backup, userId, dispatch]);

  useEffect(() => {
    setSearchedState(backup?.backups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backupSteps = [
    {
      element: '#adddepartment',
      // add language
      intro: t('ADDSTEP', { name: t('BACKUPES') }),
    },
    {
      element: '#two',
      // view
      intro: t('VIEWSTEP', { name: t('BACKUPES') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('BACKUPES') }),
    },
  ];

  const backupStepsWithoutthem = [
    {
      element: '#addBackup',
      // add
      intro: t('ADDSTEP', { name: t('BACKUPES') }),
    },
    {
      element: '#two',
      // exam setting
      intro: t('NO_SMB', { name: t('BACKUPES') }),
    },
  ];
  return canView ? (
    <Root
      header={
        <HeaderContent
          id="addBackup"
          steps={backup?.backups?.length > 0 ? backupSteps : backupStepsWithoutthem}
          instruction={t('INSTRUCTION', { name: t('BACKUPES').toLowerCase() })}
          name="BACKUPES"
          data={backup?.backups}
          disableSearch
          // addButtonTo={false}
          searchText={search}
          onSearch={(ev) => {
            setSearch(ev.target.value);
          }}
          disableAddButton={!canManage}
        />
      }
      content={<BackupList backup={searchedState} canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/backup" name="BACKUPES">
          <Outlet />
        </RightBarLayout>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={maximize ? '100%' : 640}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('BackupApp', reducer)(BackupApp);
