import { lazy } from 'react';

import authRoles from '../../../auth/authRoles';
import FileManagerFileForm from './forms/FileManagerFileForm';
import FileManagerFolderForm from './forms/FileManagerFolderForm';

const FileManagerApp = lazy(() => import('./FileManagerApp'));

const FileManagerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/fileManager',
      element: <FileManagerApp />,
      children: [
        {
          path: ':id/edit',
          element: <FileManagerFileForm />,
        },
        {
          path: 'folder/:id/edit',
          element: <FileManagerFolderForm />,
        },
      ],
    },
  ],
};

export default FileManagerAppConfig;
