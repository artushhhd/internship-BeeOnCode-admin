import { lazy } from 'react';
import FAQForm from './FAQ/FAQForm';
import authRoles from '../../../auth/authRoles';

const FAQAppConfig = lazy(() => import('./FAQApp'));

const SectionsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/faq',
      element: <FAQAppConfig />,
      children: [
        {
          path: ':id/edit',
          element: <FAQForm />,
        },
      ],
    },
  ],
};

export default SectionsAppConfig;
