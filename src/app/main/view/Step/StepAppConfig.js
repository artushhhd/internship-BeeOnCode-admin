import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import SecondaryMenusForm from './StepForm/StepForm';
import StepApp from './StepApp';

const SecondaryMenusApp = lazy(() => import('./StepApp'));

const StepAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      element: <StepApp />,
      path: 'view/step',
      children: [
        {
          path: ':id/edit',
          element: <SecondaryMenusForm />,
        },
      ],
    },
  ],
};

export default StepAppConfig;
