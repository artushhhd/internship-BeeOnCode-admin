import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import BackupForm from './backups/BackupForm';

const DepartmentsApp = lazy(() => import('./BackupApp'));

const BackupAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <DepartmentsApp />,
      path: 'view/backup',
      children: [
        {
          path: ':id/edit',
          element: <BackupForm />,
        },
      ],
    },
  ],
};

export default BackupAppConfig;
