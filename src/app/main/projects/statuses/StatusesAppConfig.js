import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import StatusForm from './status/StatusForm';

const StatusApp = lazy(() => import('./StatusApp'));

const StatusesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'projects/status',
      element: <StatusApp />,
      children: [
        {
          path: ':id/edit',
          element: <StatusForm />,
        },
      ],
    },
  ],
};

export default StatusesAppConfig;
