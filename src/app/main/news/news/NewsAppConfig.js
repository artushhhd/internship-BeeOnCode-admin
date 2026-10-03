import { lazy } from 'react';
import NewsForm from './news/NewsForm';
import authRoles from '../../../auth/authRoles';

const NewsApp = lazy(() => import('./NewsApp'));

const NewsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'news/item',
      element: <NewsApp />,
      children: [
        {
          path: ':id/edit',
          element: <NewsForm />,
        },
      ],
    },
  ],
};

export default NewsAppConfig;
