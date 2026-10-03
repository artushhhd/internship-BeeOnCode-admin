import { loginAdminUrl } from '@api/url';

const jwtServiceConfig = {
  signIn: loginAdminUrl,
  signUp: 'api/auth/sign-up',
  accessToken: 'api/auth/access-token',
  updateUser: 'api/auth/admin/update',
};

export default jwtServiceConfig;
