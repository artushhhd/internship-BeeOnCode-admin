import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from '../store';
import PermissionsTable from './PermissionsTable';
import Error404Page from '../../404/Error404Page';
import { getPermissionsByPage, selectPermission } from '../store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function Permissions() {
  const pageLayout = useRef(null);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Permissions' }));
  }, [dispatch, userId]);
  const permissionSteps = [
    {
      element: '#one',
      // role name
      intro: t('VIEWSTEP', { name: t('POSITION') }),
    },
    {
      element: '#two',
      // role control
      intro: t('VIEWSTEP', { name: t('DEPARTMENT') }),
    },
    {
      element: '#three',
      // role view
      intro: t('PERMISSION_BUTTON', { name: t('VIEW') }),
    },
    {
      element: '#four',
      // role control
      intro: t('PERMISSION_BUTTON', { name: t('MANAGE') }),
    },
  ];

  return canView ? (
    <Root
      header={
        <HeaderContent
          steps={permissionSteps}
          instruction={t('PERMISSION_INSTRUCTION')}
          name="PERMISSIONS"
          disableSearch
          disableAddButton
          disableLanguageSwitcher
        />
      }
      content={<PermissionsTable canManage={canManage} />}
      ref={pageLayout}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('administration', reducer)(Permissions);
