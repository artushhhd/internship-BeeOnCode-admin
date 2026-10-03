import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { changeMaximize } from 'app/store/RightBarSlice';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import { getFAQs, selectFilteredFaqs } from './store/FAQsSlice';
import FAQList from './FAQList';
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

function FAQApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const filteredData = useSelector(selectFilteredFaqs);

  useDeepCompareEffect(() => {
    dispatch(getFAQs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'FAQ' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);
  const { t } = useTranslation('navigation');
  const faqSteps = [
    {
      element: '#addFaq',
      // add language
      intro: t('ADDSTEP', { name: t('FAQ') }),
    },
    {
      element: '#two',
      // view
      intro: t('FAQSTEP', { which: t('FAQ'), what: t('ANSWER') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('FAQ') }),
    },
  ];
  const faqStepsWithoutthem = [
    {
      element: '#addFaq',
      // add
      intro: t('ADDSTEP', { name: t('LANGUAGE') }),
    },
    {
      element: '#two',
      // exam setting
      intro: t('NO_SMB', { name: t('LANGUAGES') }),
    },
  ];
  return canView ? (
    <Root
      header={
        <HeaderContent
          steps={filteredData?.length > 0 ? faqSteps : faqStepsWithoutthem}
          id="addFaq"
          name="FAQ"
          instruction={t('INSTRUCTION', { name: t('FAQ') })}
          data={filteredData}
          addButtonTo="new/edit"
          disableSearch
          disableAddButton={!canManage}
        />
      }
      content={<FAQList canManage={canManage} />}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/faq" name="FAQ">
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

export default withReducer('FAQApp', reducer)(FAQApp);
