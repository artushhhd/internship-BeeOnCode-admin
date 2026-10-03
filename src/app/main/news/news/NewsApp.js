import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { selectUser } from 'app/store/userSlice';
import HeaderContent from 'app/shared-components/HeaderContent';
import { useTranslation } from 'react-i18next';
import reducer from './store';
import { getNews, newsSearchFilter, selectNewsSearchText } from './store/newsSlice';
import Error404Page from '../../404/Error404Page';
import NewsList from './NewsList';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function NewsApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const news = useSelector((state) => state.newsApp?.news);
  const { t } = useTranslation('navigation');
  const searchText = useSelector(selectNewsSearchText);
  const [search, setSearch] = useState('');

  const filteredData = news?.news?.data?.filter((n) =>
    n.translations?.some((trs) => trs.title.toLowerCase().includes(searchText.toLowerCase()))
  );

  useDeepCompareEffect(() => {
    if (searchParams.get('isPubleshed')) {
      dispatch(
        getNews({
          page: +searchParams.get('page') || 1,
          isPubleshed: searchParams.get('isPubleshed'),
        })
      );
    } else {
      dispatch(
        getNews({
          page: +searchParams.get('page') || 1,
        })
      );
    }
  }, [dispatch, searchParams.get('page')]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'News' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  return canView ? (
    news?.news?.data?.length > -1 && (
      <Root
        header={
          <HeaderContent
            instruction={t('INSTRUCTION', { name: t('NEWS').toLowerCase() })}
            name="NEWS"
            data={filteredData}
            addButtonTo={`new/edit?page=${searchParams.get('page') || 1}`}
            searchText={search}
            onSearch={(e) => {
              dispatch(newsSearchFilter(e.target.value));
              setSearch(e.target.value);
            }}
            newsFilter
            disableAddButton={!canManage}
          />
        }
        content={
          <NewsList
            canManage={canManage}
            filteredData={filteredData}
            pageTotal={news?.news?.last_page}
            perPage={news?.news?.per_page}
            from={news?.news?.from}
            to={news?.news?.to}
            whole={news?.news?.total}
          />
        }
        ref={pageLayout}
        rightSidebarContent={
          <RightBarLayout
            buttonXto={`/news/item?page=${searchParams.get('page') || 1}`}
            name="NEWS"
          >
            <Outlet canManage={canManage} />
          </RightBarLayout>
        }
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarWidth={maximize ? '100%' : 640}
        scroll="content"
      />
    )
  ) : (
    <Error404Page />
  );

  /* return (

    ); */
}

export default withReducer('newsApp', reducer)(NewsApp);
