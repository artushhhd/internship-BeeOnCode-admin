import axios from 'axios';
import { notifyError } from '@helpers/toast';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;
const FILE_API_URL = process.env.REACT_APP_API_URL;
const FRONT_URL = process.env.REACT_APP_FRONT_URL;

const { REACT_APP_MODE } = process.env;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });
        sessionStorage.setItem('jwt_access_token', response.data.accessToken);
        localStorage.setItem('jwt_access_token', response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        // window.location.reload(); // ekn1000 jamanakavor, ete zapros a arvel log out exac jamanak apa reload a anum ejy
        notifyError('Not authorized');
      }
    }
    throw error;
  }
);

export { API_URL, FILE_API_URL, $api, REACT_APP_MODE, FRONT_URL };
