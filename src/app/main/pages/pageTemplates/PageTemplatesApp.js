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
import PageTemplatesList from './PageTemplatesList';
import PageTemplatesSections from './pageTemplates/PageTemplatesSections';
import PageTemplatesHeader from './PageTemplatesHeader';
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

function PageTemplatesApp(props) {
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

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'PageTemplates' }));
    if (location.pathname.indexOf('edit') > -1) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  const { translationLanguage } = useSelector((state) => state.i18n);

  return canView ? (
    <Root
      header={
        <PageTemplatesHeader
          canManage={canManage}
          translationLanguage={translationLanguage}
          onToggleLeftSidebar={handleToggleLeftSidebar}
        />
      }
      content={<PageTemplatesSections />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout
          buttonXto={+id ? `/pageTemplate/${id}` : '/pageTemplate'}
          name="PAGETEMPLATES"
        >
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
        <PageTemplatesList translationLanguage={translationLanguage} canManage={canManage} />
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

export default withReducer('PageTemplatesApp', reducer)(PageTemplatesApp);
