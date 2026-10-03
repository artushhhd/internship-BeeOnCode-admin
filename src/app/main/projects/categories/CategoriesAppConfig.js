import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import CategoryForm from './category/CategoryForm';

const CategoriesApp = lazy(() => import('./CategoriesApp'));

const CategoriesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'projects/categories',
      element: <CategoriesApp />,
      children: [
        {
          path: ':id/edit',
          element: <CategoryForm />,
        },
      ],
    },
  ],
};

export default CategoriesAppConfig;
