import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import PartnersForm from './partners/PartnersForm';

const PartnersApp = lazy(() => import('./PartnersApp'));

const PartnersAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <PartnersApp />,
      path: 'view/partners',
      children: [
        {
          path: ':id/edit',
          element: <PartnersForm />,
        },
      ],
    },
  ],
};

export default PartnersAppConfig;
