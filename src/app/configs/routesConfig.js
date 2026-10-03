import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import viewConfigs from '../main/view/viewConfigs';
import administrationConfigs from '../main/administration/administrationConfig';
import pagesConfigs from '../main/pages/pagesConfig';
import pageTemplatesConfigs from '../main/pages/pageTemplates/pageTemplatesConfig';
import projectsConfig from '../main/projects/projectsConfig';
import newsConfig from '../main/news/newsConfig';
import BackupAppConfig from '../main/view/backup/BackupAppConfig';

const routeConfigs = [
  ...viewConfigs,
  ...administrationConfigs,
  ...pagesConfigs,
  ...pageTemplatesConfigs,
  ...projectsConfig,
  DashboardConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ...newsConfig,
  BackupAppConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
