import SliderApp from './SliderApp';
import SliderForm from './slide/SliderForm';
import authRoles from '../../../auth/authRoles';

const SliderAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/slider',
      element: <SliderApp />,
      children: [
        {
          path: ':id/edit',
          element: <SliderForm />,
        },
      ],
    },
  ],
};

export default SliderAppConfig;
