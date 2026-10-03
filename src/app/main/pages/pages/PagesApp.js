import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import reducer from './store';
import PagesList from './PagesList';
import PageSections from './pages/PageSections';
import PagesHeader from './PagesHeader';
import Error404Page from '../../404/Error404Page';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function PagesApp(props) {
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const location = useLocation();
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const { id } = useParams();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const dispatch = useDispatch();
  const [stat, setStat] = useState('dynamic');

  useEffect(() => {
    if (location.pathname.indexOf('edit') > -1) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    // eslint-disable-next-line
  }, [userId]);

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  const { translationLanguage } = useSelector((state) => state.i18n);

  return canView ? (
    <Root
      header={
        <PagesHeader
          stat={stat}
          translationLanguage={translationLanguage}
          pageLayout={pageLayout}
          onToggleLeftSidebar={handleToggleLeftSidebar}
          canManage={canManage}
        />
      }
      content={<PageSections />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto={+id ? `/pages/${id}` : '/pages'} name="PAGES">
          <Outlet />
        </RightBarLayout>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => {
        setRightSidebarOpen(false);
      }}
      rightSidebarWidth={maximize ? '100%' : 640}
      leftSidebarOpen={leftSidebarOpen && !maximize}
      leftSidebarContent={
        <PagesList
          stat={stat}
          setStat={setStat}
          translationLanguage={translationLanguage}
          canManage={canManage}
        />
      }
      leftSidebarOnClose={() => {
        setLeftSidebarOpen(false);
      }}
      leftSidebarWidth={maximize ? 0 : 400}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('PagesApp', reducer)(PagesApp);
