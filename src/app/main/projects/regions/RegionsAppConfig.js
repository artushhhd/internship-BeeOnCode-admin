import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import RegionForm from './region/RegionForm';

const RegionsApp = lazy(() => import('./RegionsApp'));

const RegionsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'projects/regions',
      element: <RegionsApp />,
      children: [
        {
          path: ':id/edit',
          element: <RegionForm />,
        },
      ],
    },
  ],
};

export default RegionsAppConfig;
