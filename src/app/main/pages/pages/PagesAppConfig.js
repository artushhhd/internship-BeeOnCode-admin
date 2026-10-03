import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import PagesForm from './pages/PagesForm';
import PageSectionsForm from './pageSections/PageSectionsForm';
import PageSections from './pages/PageSections';
import StaticPageForm from './pages/StaticPageForm';

const PagesApp = lazy(() => import('./PagesApp'));

const PagesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'pages',
      element: <PagesApp />,
      children: [
        {
          path: ':id',
          element: <PageSections />,
        },
        {
          path: ':id/edit',
          element: <PagesForm />,
        },
        {
          path: ':id/edit/:type',
          element: <PagesForm />,
        },
        {
          path: ':id/edit/static/:role',
          element: <StaticPageForm />,
        },
        {
          path: ':id/section/:sectionId/edit',
          element: <PageSectionsForm />,
        },
        {
          path: ':id/tab/:tabId/section/:sectionId/edit',
          element: <PageSectionsForm />,
        },
        {
          path: ':id/accordion/:accordionId/section/:sectionId/edit',
          element: <PageSectionsForm />,
        },
      ],
    },
  ],
};

export default PagesAppConfig;
