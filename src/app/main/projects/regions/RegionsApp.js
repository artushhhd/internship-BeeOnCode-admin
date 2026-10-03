import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from '../store';
import RegionsList from './RegionsList';

import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';
import Error404Page from '../../404/Error404Page';
import {
  getRegions,
  selectRegions,
  selectRegionsSearchText,
  setRegionsSearchText,
} from '../store/regionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function RegionsApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const regions = useSelector(selectRegions);
  const { t } = useTranslation('navigation');
  const searchText = useSelector(selectRegionsSearchText);

  const filteredData = regions.filter((cat) =>
    cat.translations.some((trs) => trs.title.toLowerCase().includes(searchText.toLowerCase()))
  );
  useDeepCompareEffect(() => {
    dispatch(getRegions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Regions' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  const regionsteps = [
    {
      element: '#regions',
      // add
      intro: t('ADDSTEP', { name: t('REGION') }),
    },
    {
      element: '#two',
      intro: t('VIEWSTEP', { name: t('REGION') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('REGION') }),
    },
  ];

  return canView ? (
    <Root
      header={
        <HeaderContent
          id="regions"
          steps={regionsteps}
          instruction={t('INSTRUCTION', { name: t('REGIONS').toLowerCase() })}
          name="REGIONS"
          data={filteredData}
          addButtonTo="new/edit"
          searchText={searchText}
          onSearch={(e) => dispatch(setRegionsSearchText(e))}
          disableAddButton={!canManage}
        />
      }
      content={<RegionsList canManage={canManage} filteredData={filteredData} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/projects/regions" name="REGIONS">
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

export default withReducer('ProjectsApp', reducer)(RegionsApp);
