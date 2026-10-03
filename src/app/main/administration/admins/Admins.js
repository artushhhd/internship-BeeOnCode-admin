import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from '../store';
import AdminsTable from './AdminsTable';
import Error404Page from '../../404/Error404Page';
import { selectAdmins, selectAdminsSearchText, setAdminsSearchText } from '../store/adminsSlice';
import { getPermissionsByPage, selectPermission } from '../store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function Admins() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const searchText = useSelector(selectAdminsSearchText);
  const users = useSelector(selectAdmins);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'admins' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);
  const adminSteps = [
    {
      element: '#adminAdd',
      // add
      intro: t('ADDSTEP', { name: t('POSITION') }),
    },
    {
      element: '#two',
      // view setting
      intro: t('VIEWSTEP', { name: t('POSITION') }),
    },
    {
      element: '#three',
      intro: t('VIEW_ADMIN', { name: t('ADMIN') }),
    },
    {
      element: '#four',
      intro: t('VIEWSTEP', { name: t('ROLE') }),
    },
    {
      element: '#five',
      intro: t('VIEWSTEP', { name: t('STATUS') }),
    },
    {
      element: '#six',
      intro: t('QUESTIONSTEP5', { name: t('ADMIN') }),
    },
    {
      element: '#seven',
      intro: t('VIEWSTEP', { name: t('CHANGEHISTORY') }),
    },
  ];
  return canView ? (
    <Root
      header={
        <HeaderContent
          id="adminAdd"
          steps={adminSteps}
          instruction={t('INSTRUCTION', { name: t('ADMIN') })}
          name="ADMINS"
          data={users}
          searchText={searchText}
          onSearch={(ev) => dispatch(setAdminsSearchText(ev))}
          disableAddButton={!canManage}
        />
      }
      content={<AdminsTable canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/administration/admins" name="ADMINS">
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

export default withReducer('administration', reducer)(Admins);
