import authRoles from '../../../auth/authRoles';
import YoutubeSettingsApp from './YoutubeSettingsApp';

const YoutubeSettingsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <YoutubeSettingsApp />,
      path: 'view/youtube/settings',
    },
  ],
};

export default YoutubeSettingsAppConfig;
