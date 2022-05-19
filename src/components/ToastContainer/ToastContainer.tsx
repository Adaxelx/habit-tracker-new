import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { ToastContainer as RTToastContainer, ToastOptions } from 'react-toastify';
import { toast } from 'react-toastify';

export const showToast = (message: string, options: ToastOptions) =>
  toast(message, { theme: 'colored', ...options });

const ToastContainer = () => {
  return (
    <RTToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastContainer;
