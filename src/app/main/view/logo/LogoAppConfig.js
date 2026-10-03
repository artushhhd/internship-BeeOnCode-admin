import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';

const LogoApp = lazy(() => import('./LogoApp'));

const LogoAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/logo',
      element: <LogoApp />,
    },
  ],
};

export default LogoAppConfig;
