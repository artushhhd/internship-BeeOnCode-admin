import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import FooterList from './FooterList';
import reducer from './store';
import Error404Page from '../../../404/Error404Page';
import { getSections, selectFilteredSections } from './store/footersSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { getSection, newSection } from './store/footerSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function FooterApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const filteredData = useSelector(selectFilteredSections);
  const { t } = useTranslation('navigation');
  const routeParams = useParams();

  useDeepCompareEffect(() => {
    dispatch(getSections());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Footer' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newSection());
    } else {
      dispatch(getSection(routeParams.id));
    }
    // eslint-disable-next-line
  }, [routeParams.id]);

  return canView ? (
    <Root
      header={
        <HeaderContent
          instruction={t('INSTRUCTION', { name: t('FOOTER').toLowerCase() })}
          name="FOOTER"
          data={filteredData}
          addButtonTo="new/edit"
          disableSearch
          disableAddButton={!canManage}
        />
      }
      content={<FooterList canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/footer/sections" name="FOOTER">
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

export default withReducer('sectionsApp', reducer)(FooterApp);
