import { lazy } from 'react';
import FooterView from './section/FooterView';
import FooterForm from './section/FooterForm';
import authRoles from '../../../../auth/authRoles';

const FooterApp = lazy(() => import('./FooterApp'));

const FooterAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/footer/sections',
      element: <FooterApp />,
      children: [
        {
          path: ':id',
          element: <FooterView />,
        },
        {
          path: ':id/edit',
          element: <FooterForm />,
        },
      ],
    },
  ],
};

export default FooterAppConfig;
