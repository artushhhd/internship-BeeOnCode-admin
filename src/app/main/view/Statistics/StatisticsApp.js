import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import reducer from './store';
// import { getSecondaryMenu } from './store/secondaryMenuSlice';
import StatisticsList from './StatisticsList';
import Error404Page from '../../404/Error404Page';
import { selectPermission } from '../../administration/store/permissionsSlice';
import useThemeMediaQuery from '../../../../@fuse/hooks/useThemeMediaQuery';

import StatisticsHeader from './StatisticsHeader';
import { getStatistics } from './store/StatisticsSlice';
import { getStatuses } from '../../projects/store/statusesSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function StatisticsApp() {
  const location = useLocation();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const {
    statistics: { statisticsSettings },
    loading,
  } = useSelector((state) => state.StatisticsApp.statiscticsReducer);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    dispatch(getStatistics());
    dispatch(getStatuses());
  }, [dispatch]);
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  return canView ? (
    <Root
      header={
        <StatisticsHeader
          pageLayout={pageLayout}
          onToggleLeftSidebar={handleToggleLeftSidebar}
          canManage={canManage}
        />
      }
      content={<StatisticsList statistics={statisticsSettings} canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/statistics" name="STATISTICS">
          <Outlet canManage={canManage} />
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

export default withReducer('StatisticsApp', reducer)(StatisticsApp);
