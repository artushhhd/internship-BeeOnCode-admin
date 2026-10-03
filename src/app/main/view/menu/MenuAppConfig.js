import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import MenuForm from './menu/MenuForm';

const MenuApp = lazy(() => import('./MenuApp'));

const MenuAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/menu',
      element: <MenuApp />,
      children: [
        {
          path: ':id/edit',
          element: <MenuForm />,
        },
      ],
    },
  ],
};

export default MenuAppConfig;
