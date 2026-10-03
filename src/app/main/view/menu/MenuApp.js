import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import reducer from './store';
import MenuHeader from './MenuHeader';
import { getMenu } from './store/menuSlice';
import Error404Page from '../../404/Error404Page';
import MenuList from './MenuList';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function MenuApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [collapseAll, setCollapseAll] = useState(true);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();

  useDeepCompareEffect(() => {
    dispatch(getMenu(translationLanguage));
  }, [dispatch, translationLanguage]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Menu' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  const [search, setSearch] = useState('');

  return canView ? (
    <Root
      header={
        <MenuHeader
          pageLayout={pageLayout}
          collapseAll={collapseAll}
          setCollapseAll={setCollapseAll}
          onToggleLeftSidebar={handleToggleLeftSidebar}
          search={search}
          setSearch={setSearch}
          canManage={canManage}
        />
      }
      content={
        <MenuList
          search={search}
          collapseAll={collapseAll}
          setCollapseAll={setCollapseAll}
          canManage={canManage}
        />
      }
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/menu" name="MENU">
          <Outlet />
        </RightBarLayout>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={maximize ? '100%' : 640}
      leftSidebarOpen={leftSidebarOpen && !maximize}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('menuApp', reducer)(MenuApp);
