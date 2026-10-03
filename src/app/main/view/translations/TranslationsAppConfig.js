import authRoles from '../../../auth/authRoles';
import TranslationApp from './TranslationsApp';

const TranslationsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <TranslationApp />,
      path: 'view/translations',
    },
  ],
};
export default TranslationsAppConfig;
