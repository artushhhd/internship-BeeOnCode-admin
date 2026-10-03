import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { useTranslation } from 'react-i18next';
import { changeMaximize } from 'app/store/RightBarSlice';
import { useDispatch, useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import RolesTable from './RolesTable';
import reducer from '../store';
import Error404Page from '../../404/Error404Page';
import { selectRoles, selectRolesSearchText, setRolesSearchText } from '../store/rolesSlice';
import { getPermissionsByPage, selectPermission } from '../store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function Roles(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const searchText = useSelector(selectRolesSearchText);
  const roles = useSelector(selectRoles);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Roles' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);
  const rolesSteps = [
    {
      element: '#rolesSteps',
      // add
      intro: t('ADDSTEP', { name: t('POSITION') }),
    },
    {
      element: '#two',
      // exam setting
      intro: t('VIEWSTEP', { name: t('POSITION') }),
    },
    {
      element: '#three',
      intro: t('VIEW_ADMIN', { name: t('POSITION') }),
    },
    {
      element: '#four',
      intro: t('QUESTIONSTEP5', { name: t('POSITION') }),
    },
    {
      element: '#five',
      intro: t('VIEWSTEP', { name: t('CHANGEHISTORY') }),
    },
  ];
  return canView ? (
    <Root
      header={
        <HeaderContent
          id="rolesSteps"
          steps={rolesSteps}
          instruction={t('INSTRUCTION', { name: t('ROLES') })}
          name="ROLES"
          searchText={searchText}
          data={roles}
          onSearch={(ev) => dispatch(setRolesSearchText(ev))}
          disableAddButton={!canManage}
        />
      }
      content={<RolesTable canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/administration/roles" name="ROLES">
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

export default withReducer('administration', reducer)(Roles);
