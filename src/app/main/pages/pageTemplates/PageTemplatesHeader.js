import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderContent from 'app/shared-components/HeaderContent';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import {
  getInactivePageTemplates,
  getPageTemplates,
  selectPageTemplates,
} from './store/pageTemplatesSlice';
import { getPageTemplate, newPageTemplate, selectPageTemplate } from './store/pageTemplateSlice';
import { selectedTemplateSections } from './store/pageTemplateSectionsSlice';

function PageTemplatesHeader({ onToggleLeftSidebar, translationLanguage, canManage }) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const navigate = useNavigate();
  const pageTemplates = useSelector(selectPageTemplates);
  const { t } = useTranslation('navigation');
  const pageTemplateSections = useSelector(selectedTemplateSections);

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newPageTemplate());
    } else {
      dispatch(getPageTemplate(routeParams.id));
    }
  }, [dispatch, routeParams]);

  const pageTemplate = useSelector(selectPageTemplate);
  const PageTemplStep1 = [
    {
      element: '#step1',
      // add page template
      intro: t('ADDSTEP', { name: t('PAGETEMPLATES') }),
    },
    {
      element: '#step2',
      // view page template
      intro: t('VIEWSTEP', { name: t('PAGETEMPLATES') }),
    },
  ];

  const PageTemplStep2 = [
    {
      element: '#step2',
      // view page template
      intro: t('QUESTIONSTEP4', { which: t('PAGETEMPLATES'), what: t('SECTIONS') }),
    },
    {
      element: '#step3',
      // view and edit page template
      intro: t('QUESTIONSTEP5', { name: t('PAGETEMPLATES') }),
    },
  ];

  const PageTemplStep3 = [
    {
      element: '#addPageTempl',
      // add section
      intro: t('ADDSTEPALL', { name: t('SECTION') }),
    },
  ];
  const OrigSteps =
    routeParams.id && pageTemplateSections.length > 0 ? PageTemplStep2 : PageTemplStep3;
  return (
    <HeaderContent
      id="addPageTempl"
      steps={!routeParams.id ? PageTemplStep1 : OrigSteps}
      instruction={t('INSTRUCTION', { name: t('PAGETEMPLATES').toLowerCase() })}
      name="PAGETEMPLATES"
      data={pageTemplates}
      subtitle={
        pageTemplate?.translations?.find((val) => val.language_id === translationLanguage)?.title
      }
      addButtonTo={`/pageTemplate/${routeParams.id}/section/new/edit`}
      disableAddButton={
        !canManage || routeParams.id === 'new' || routeParams.sectionId === 'new' || !routeParams.id
      }
      viewDeleted={[
        () => dispatch(getInactivePageTemplates()).then(() => navigate('/pageTemplate')),
        () => dispatch(getPageTemplates()).then(() => navigate('/pageTemplate')),
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

export default PageTemplatesHeader;
