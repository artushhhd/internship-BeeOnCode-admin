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
import StepList from './StepList';
import Error404Page from '../../404/Error404Page';
import { selectPermission } from '../../administration/store/permissionsSlice';
import useThemeMediaQuery from '../../../../@fuse/hooks/useThemeMediaQuery';
import StepHeader from './StepHeader';
import { getStep } from './store/StepSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function StepApp() {
  const location = useLocation();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const { step } = useSelector((state) => state.StepApp.secondaryMenuReducer);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    dispatch(getStep());
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
        <StepHeader
          pageLayout={pageLayout}
          onToggleLeftSidebar={handleToggleLeftSidebar}
          canManage={canManage}
        />
      }
      content={<StepList step={step?.active_steps} canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/step" name="STEP">
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

export default withReducer('StepApp', reducer)(StepApp);
