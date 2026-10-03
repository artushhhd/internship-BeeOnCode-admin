import { lazy } from 'react';
import LanguageForm from './language/LanguageForm';
import authRoles from '../../../auth/authRoles';

const LanguagesApp = lazy(() => import('./LanguagesApp'));

const LanguagesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/languages',
      element: <LanguagesApp />,
      children: [
        {
          path: ':id/edit',
          element: <LanguageForm />,
        },
      ],
    },
  ],
};

export default LanguagesAppConfig;
