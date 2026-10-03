import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import AnnouncementForm from './announcement/AnnouncementForm';

const AnnouncementAppConfig = lazy(() => import('./AnnouncementApp'));

const SectionsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/announcement',
      element: <AnnouncementAppConfig />,
      children: [
        {
          path: ':id/edit',
          element: <AnnouncementForm />,
        },
      ],
    },
  ],
};

export default SectionsAppConfig;
