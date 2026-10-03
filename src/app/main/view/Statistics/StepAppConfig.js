import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import SecondaryMenusForm from './StatisticsForm/StatisticsForm';
import StatisticsApp from './StatisticsApp';

const SecondaryMenusApp = lazy(() => import('./StatisticsApp'));

const StatisticsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <StatisticsApp />,
      path: 'view/statistics',
      children: [
        {
          path: ':id/edit',
          element: <SecondaryMenusForm />,
        },
      ],
    },
  ],
};

export default StatisticsAppConfig;
