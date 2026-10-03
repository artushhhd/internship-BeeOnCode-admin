import Admins from './Admins';
import AdminForm from '../admin/AdminForm';
import authRoles from '../../../auth/authRoles';

const AdminsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'administration/admins',
      element: <Admins />,
      children: [
        {
          path: ':id/edit',
          element: <AdminForm />,
        },
      ],
    },
  ],
};

export default AdminsConfig;
