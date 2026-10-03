import authRoles from '../../auth/authRoles';
import Dashboard from './Dashboard';

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'dashboard',
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;
