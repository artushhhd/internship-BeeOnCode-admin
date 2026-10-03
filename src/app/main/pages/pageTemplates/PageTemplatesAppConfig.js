import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import PageTemplatesForm from './pageTemplates/PageTemplatesForm';
import PageTemplateSectionsForm from './pageTemplatesSections/PageTemplateSectionsForm';
import PageTemplatesSections from './pageTemplates/PageTemplatesSections';

const PageTemplatesApp = lazy(() => import('./PageTemplatesApp'));

const PageTemplatesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'pageTemplate',
      element: <PageTemplatesApp />,
      children: [
        {
          path: ':id',
          element: <PageTemplatesSections />,
        },
        {
          path: ':id/edit',
          element: <PageTemplatesForm />,
        },
        {
          path: ':id/section/new/edit',
          element: <PageTemplateSectionsForm />,
        },
        {
          path: ':id/tab/:tabId/section/:sectionId/edit',
          element: <PageTemplateSectionsForm />,
        },
        {
          path: ':id/accordion/:accordionId/section/:sectionId/edit',
          element: <PageTemplateSectionsForm />,
        },
      ],
    },
  ],
};

export default PageTemplatesAppConfig;
