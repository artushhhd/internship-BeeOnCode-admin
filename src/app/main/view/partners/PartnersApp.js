import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from './store';
import { getPartners } from './store/partnersSlice';
import PartnersList from './PartnersList';
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

function PartnersApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const { partners } = useSelector((state) => state.PartnersApp.partnersReducer);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useDeepCompareEffect(() => {
    dispatch(getPartners(+searchParams.get('page') || 1));
  }, [dispatch, searchParams.get('page')]);
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  const [search, setSearch] = useState('');
  const [searchedState, setSearchedState] = useState([]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Partners' }));
    if (partners.length) {
      setSearchedState(partners);
    }
  }, [partners, userId, dispatch]);

  const filteredData = partners.data?.filter((n) =>
    n.translations.some((trs) => trs.title.toLowerCase().includes(search.toLowerCase()))
  );

  const partnersSteps = [
    {
      element: '#partnerAdd',
      // add
      intro: t('ADDSTEP', { name: t('PARTNERS') }),
    },
    {
      element: '#two',
      intro: t('VIEWSTEP', { name: t('PARTNERS') }),
    },
    {
      element: '#three',
      intro: t('CHANGESTEP', { name: t('STATUS'), which: t('PARTNERS') }),
    },
    {
      element: '#four',
      intro: t('EYE_VIEW', { name: t('PARTNERS') }),
    },
    {
      element: '#five',
      intro: t('QUESTIONSTEP5', { name: t('PARTNERS') }),
    },
  ];

  const partnerStepsWithoutthem = [
    {
      element: '#partnerAdd',
      // add
      intro: t('ADDSTEP', { name: t('PARTNERS') }),
    },
    {
      element: '#two',
      // exam setting
      intro: t('NO_SMB', { name: t('PARTNERS') }),
    },
  ];

  return canView ? (
    <Root
      header={
        <HeaderContent
          id="partnerAdd"
          steps={filteredData?.length > 0 ? partnersSteps : partnerStepsWithoutthem}
          instruction={t('INSTRUCTION', { name: t('PARTNERS').toLowerCase() })}
          name="PARTNERS"
          data={partners}
          searchText={search}
          onSearch={(ev) => {
            setSearch(ev.target.value);
          }}
          disableAddButton={!canManage}
        />
      }
      content={
        <PartnersList
          partners={filteredData}
          canManage={canManage}
          pageTotal={partners?.last_page}
          from={partners?.from}
          to={partners?.to}
          whole={partners?.total}
        />
      }
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout
          buttonXto={`/view/partners?page=${searchParams.get('page') || 1}`}
          name="PARTNERS"
        >
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

export default withReducer('PartnersApp', reducer)(PartnersApp);
