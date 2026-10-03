import Permissions from './Permissions';
import authRoles from '../../../auth/authRoles';

const PermissionsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'administration/permissions',
      element: <Permissions />,
    },
  ],
};

export default PermissionsConfig;
