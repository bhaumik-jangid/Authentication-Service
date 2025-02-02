"use client";
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = ({ toastertype, msg, ...toastOptions }) => {
  useEffect(() => {
    const { duration = 3000, position = 'top-center', style = {}, ...restOptions } = toastOptions;

    const toastConfig = {
      ...restOptions,
      position,
      autoClose: duration,
      style,
    };

    // Select the appropriate toast type based on the `toastertype`
    switch (toastertype) {
      case 'success':
        toast.success(msg, toastConfig);
        break;
      case 'error':
        toast.error(msg, toastConfig);
        break;
      case 'info':
        toast.info(msg, toastConfig);
        break;
      case 'warning':
        toast.warning(msg, toastConfig);
        break;
      default:
        toast(msg, toastConfig);
    }
  }, [toastertype, msg, toastOptions]);

  return <ToastContainer />;
};

export default Notification;
