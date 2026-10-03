import Roles from './Roles';
import RoleForm from '../role/RoleForm';
import authRoles from '../../../auth/authRoles';

const RolesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'administration/roles',
      element: <Roles />,
      children: [
        {
          path: ':id/edit',
          element: <RoleForm />,
        },
      ],
    },
  ],
};

export default RolesConfig;
