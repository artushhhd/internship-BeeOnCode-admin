import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import ServiceForm from './service/ServiceForm';

const ServicesApp = lazy(() => import('./ServicesApp'));

const ServicesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/services',
      element: <ServicesApp />,
      children: [
        {
          path: ':id/edit',
          element: <ServiceForm />,
        },
      ],
    },
  ],
};

export default ServicesAppConfig;
