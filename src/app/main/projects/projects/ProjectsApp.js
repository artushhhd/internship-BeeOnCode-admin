import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import reducer from '../store';
import { getProjects, projectSearch } from '../store/projectsSlice';
import Error404Page from '../../404/Error404Page';
import ProjectsList from './ProjectsList';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';
import { getCrossArea, selectCrossArea } from '../store/projectSlice';
import { getAreas, selectAreas } from '../store/areasSlice';
import { getRegions, selectRegions } from '../store/regionsSlice';
import { getStatuses, selectStatuses } from '../store/statusesSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ProjectsApp() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');
  const projects = useSelector((state) => state.ProjectsApp.projects);
  const [search, setSearch] = useState('');
  const filteredData = projects?.projects?.data || [];

  const areas = useSelector(selectAreas);
  const status = useSelector(selectStatuses);
  const crossArea = useSelector(selectCrossArea);
  const regions = useSelector(selectRegions);
  const [allArea, setAllArea] = useState([]);

  useEffect(() => {
    dispatch(getCrossArea());
    dispatch(getAreas('focal_area'));
    dispatch(getRegions());
    dispatch(getStatuses());
  }, [dispatch]);
  useEffect(() => {
    if (areas && crossArea) {
      setAllArea([...areas, ...crossArea]);
    }
  }, [areas, crossArea]);

  useDeepCompareEffect(() => {
    if (searchParams.get('isPubleshed')) {
      dispatch(
        getProjects({
          page: +searchParams.get('page') || 1,
          isPubleshed: searchParams.get('isPubleshed'),
          sort: searchParams.get('sort'),
          sorting: searchParams.get('sorting'),
          statusId: searchParams.get('status'),
        })
      );
    } else {
      dispatch(
        getProjects({
          page: +searchParams.get('page') || 1,
          sort: searchParams.get('sort'),
          sorting: searchParams.get('sorting'),
          statusId: searchParams.get('status'),
        })
      );
    }
  }, [
    dispatch,
    searchParams.get('page'),
    searchParams.get('status'),
    searchParams.get('sorting'),
    searchParams.get('sort'),
  ]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Projects' }));
    const globalRegex = new RegExp('edit', 'gm');
    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  const projectsteps = [
    {
      element: '#projectProject',
      // add
      intro: t('ADDSTEP', { name: t('PROJECT') }),
    },
    {
      element: '#one',
      // filter
      intro: t('FILTER_STEP', { name: t('PROJECT') }),
    },
    {
      element: '#two',
      intro: `${t('VIEWSTEP', { name: t('PROJECT') })} : ${t('SEEMORE', { name: t('PROJECT') })}`,
    },
    {
      element: '#three',
      intro: t('EYE_VIEW', { name: t('PROJECT') }),
    },
    {
      element: '#four',
      intro: t('QUESTIONSTEP5', { name: t('PROJECT') }),
    },
  ];

  return canView ? (
    <Root
      header={
        <HeaderContent
          id="projectProject"
          steps={projectsteps}
          instruction={t('INSTRUCTION', { name: t('PROJECTS').toLowerCase() })}
          name="PROJECTS"
          data={filteredData}
          addButtonTo={`new/edit?page=${searchParams.get('page') || 1}`}
          searchText={search}
          // disableNote
          onSearch={(e) => {
            dispatch(projectSearch(e.target.value));
            setSearch(e.target.value);
          }}
          disableAddButton={!canManage}
          // disableSearch
          projectFilter
          allArea={allArea}
          regions={regions}
          status={status}
        />
      }
      content={
        <ProjectsList
          canManage={canManage}
          filteredData={filteredData}
          pageTotal={projects?.projects?.last_page}
          from={projects?.projects?.from}
          to={projects?.projects?.to}
          whole={projects?.projects?.total}
        />
      }
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout
          buttonXto={`/projects/item?page=${searchParams.get('page') || 1}`}
          name="PROJECTS"
        >
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

export default withReducer('ProjectsApp', reducer)(ProjectsApp);
