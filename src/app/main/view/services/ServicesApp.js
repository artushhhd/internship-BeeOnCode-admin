import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';

import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import { getServices } from './store/servicesSlice';
import ServicesHeader from './ServicesHeader';
import ServicesList from './ServicesList';
import reducer from './store';
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

function ServicesApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canManage, canView } = useSelector(selectPermission);

  useDeepCompareEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    const globalRegex = new RegExp('edit', 'gm');
    dispatch(getPermissionsByPage({ userId, pageName: 'Services' }));
    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  return canView ? (
    <Root
      header={<ServicesHeader canManage={canManage} />}
      content={<ServicesList canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/services" name="SERVICES">
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

export default withReducer('ServicesApp', reducer)(ServicesApp);
