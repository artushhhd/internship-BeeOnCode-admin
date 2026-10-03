import { lazy } from 'react';
import SocialForm from './social/SocialForm';
import authRoles from '../../../auth/authRoles';

const SocialsApp = lazy(() => import('./SocialsApp'));

const SocialsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/socials',
      element: <SocialsApp />,
      children: [
        {
          path: ':id/edit',
          element: <SocialForm />,
        },
      ],
    },
  ],
};

export default SocialsAppConfig;
