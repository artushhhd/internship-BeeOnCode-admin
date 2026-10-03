import { lazy } from 'react';
import ProjectsForm from './projects/ProjectsForm';
import authRoles from '../../../auth/authRoles';

const ProjectsApp = lazy(() => import('./ProjectsApp'));

const ProjectsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'projects/item',
      element: <ProjectsApp />,
      children: [
        {
          path: ':id/edit',
          element: <ProjectsForm />,
        },
      ],
    },
  ],
};

export default ProjectsAppConfig;
