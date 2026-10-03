import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import HeaderContent from 'app/shared-components/HeaderContent';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { getPage, newPage, selectPage } from './store/pageSlice';
import { getInactivePages, getPages, selectPages } from './store/pagesSlice';
import {
  getInactivePageTemplates,
  getPageTemplates,
} from '../pageTemplates/store/pageTemplatesSlice';
import { selectedSections } from './store/pageSectionsSlice';

function PagesHeader({ onToggleLeftSidebar, translationLanguage, canManage, stat }) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pages = useSelector(selectPages);
  const isStatic = stat === 'dynamic' ? 'addSectionInPage' : 'notToShow';
  const { t } = useTranslation('navigation');

  useEffect(() => {
    dispatch(searchParams.get('deleted') ? getInactivePageTemplates() : getPageTemplates());
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newPage());
    } else {
      dispatch(getPage(routeParams.id));
    }
  }, [dispatch, routeParams]);

  const page = useSelector(selectPage);
  const pageSections = useSelector(selectedSections);

  const pagesSteps = [
    {
      element: '#step1',
      // choose page type. dynamic is changeable,static no
      intro: `${t('QUESTIONSTEP1', { name: t('PAGE') })} : ${t('PAGE_DIFFERENCE')}`,
    },
    {
      element: '#step2',
      // add page
      intro: t('QUESTIONSTEP2', { name: t('PAGE') }),
    },
    {
      element: '#step3',
      // choose page
      intro: t('VIEWSTEP', { name: t('PAGE') }),
    },
  ];

  const HavePage = [
    {
      element: '#step1',
      // choose page type. dynamic is changeable,static no
      intro: `${t('QUESTIONSTEP1', { name: t('PAGE') })} : ${t('PAGE_DIFFERENCE')}`,
    },
    {
      element: '#step2',
      // add page
      intro: t('QUESTIONSTEP2', { name: t('PAGE') }),
    },
    {
      element: '#step4',
      // choose page
      intro: `${t('VIEWSTEP', { name: t('PAGE') })} : ${t('SEEMORE', { name: t('SECTION') })}`,
    },
    {
      element: '#step5',
      // see,edit,move to page
      intro: t('SEEMORE', { name: t('PAGE') }),
    },
  ];

  const HavePageSection = [
    {
      element: '#addSectionInPage',
      // add section
      intro: t('ADDSTEP', { name: t('SECTION') }),
    },
    {
      element: '#step7',
      // view section,click for more
      intro: `${t('VIEWSTEP', { name: t('SECTION') })} : ${t('SEEMORE', { name: t('SECTION') })}`,
    },
    {
      element: '#step8',
      // edit page section
      intro: t('QUESTIONSTEP5', { name: t('SECTION') }),
    },
  ];

  const isPageStatic = [
    {
      element: '#step9',
      // rightbar
      intro: t('VIEWSTEP', { name: `${t('STATIC')} ${t('PAGES')}` }),
    },
  ];

  const step1 = pages?.length > 0 ? HavePage : pagesSteps;
  const step2 = pageSections.length > 0 ? HavePageSection : step1;
  const step3 = stat !== 'static' ? step2 : isPageStatic;

  return (
    <HeaderContent
      id={isStatic}
      steps={stat !== 'static' ? step2 : step3}
      instruction={t('INSTRUCTION', { name: t('PAGES').toLowerCase() })}
      name="PAGES"
      data={pages}
      subtitle={page?.translations.find((val) => val.language_id === translationLanguage)?.title}
      addButtonTo={`/pages/${routeParams.id}/section/new/edit`}
      disableAddButton={
        !canManage ||
        !routeParams.id ||
        routeParams.id === 'new' ||
        routeParams.sectionId === 'new' ||
        page?.type === 'static'
      }
      viewDeleted={[
        () => dispatch(getInactivePages()).then(() => navigate('/pages')),
        () => dispatch(getPages()).then(() => navigate('/pages')),
      ]}
      disableSearch
      additionalMenu={
        <Button
          className="min-w-0"
          onClick={(_) => onToggleLeftSidebar()}
          aria-label="open left sidebar"
        >
          <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
        </Button>
      }
      addLabel="SECTION"
    />
  );
}

export default PagesHeader;
