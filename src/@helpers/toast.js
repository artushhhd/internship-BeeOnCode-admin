import { toast } from 'react-toastify';

export const notifySuccess = (message) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    className: 'toast-success',
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    className: 'toast-error',
  });
};
