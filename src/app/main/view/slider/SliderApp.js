import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { changeMaximize } from 'app/store/RightBarSlice';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import SliderList from './SliderList';
import reducer from './store';
import { getSlides, selectSlider } from './store/sliderSlice';
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

function SliderApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [collapseAll, setCollapseAll] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const slider = useSelector(selectSlider);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');
  useDeepCompareEffect(() => {
    dispatch(getSlides());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Slider' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);
  const sliderSteps = [
    {
      element: '#addSlider',
      // add slider
      intro: t('ADDSTEP', { name: t('SLIDER') }),
    },
    {
      element: '#two',
      // view slider
      intro: t('VIEWSTEP', { name: t('SLIDER') }),
    },
    {
      element: '#four',
      // slider name
      intro: t('SLIDER_COLOR', { which: t('SLIDER'), what: t('NAME') }),
    },
    {
      element: '#five',
      // slider color
      intro: t('SLIDER_COLOR', { which: t('SLIDER'), what: t('COLOR') }),
    },
    {
      element: '#six',
      // slider edit
      intro: t('QUESTIONSTEP5', { name: t('SLIDER') }),
    },
  ];

  const sliderStepsWithoutThem = [
    {
      element: '#addSlider',
      // add slider
      intro: t('ADDSTEP', { name: t('SLIDER') }),
    },
    {
      element: '#two',
      // view slider
      intro: t('NO_SMB', { name: t('SLIDER') }),
    },
  ];

  return canView ? (
    <Root
      header={
        <HeaderContent
          id="addSlider"
          steps={slider.length > 0 ? sliderSteps : sliderStepsWithoutThem}
          instruction={t('INSTRUCTION', { name: t('SLIDER').toLowerCase() })}
          name="SLIDER"
          data={slider}
          addButtonTo="new/edit"
          disableSearch
          eyeOpen
          setCollapseAll={setCollapseAll}
          collapseAll={collapseAll}
          disableAddButton={!canManage}
        />
      }
      content={
        <SliderList
          collapseAll={collapseAll}
          setCollapseAll={setCollapseAll}
          canManage={canManage}
        />
      }
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/slider" name="SLIDER">
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

export default withReducer('sliderApp', reducer)(SliderApp);
