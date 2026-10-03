import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import AreaForm from './area/AreaForm';

const AreasApp = lazy(() => import('./AreasApp'));

const AreasAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'projects/areas',
      element: <AreasApp />,
      children: [
        {
          path: ':id/edit',
          element: <AreaForm />,
        },
      ],
    },
  ],
};

export default AreasAppConfig;
