"use client";
import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const Notification = ({ toastertype, msg, ...toastOptions }) => {
  useEffect(() => {
    const {
      duration = 3000,
      position = "top-center",
      style = {},
      ...restOptions
    } = toastOptions;

    const toastConfig = {
      duration,
      position,
      style,
      ...restOptions,
    };
    switch (toastertype) {
      case "success":
        toast.success(msg, toastConfig);
        break;
      case "error":
        toast.error(msg, toastConfig);
        break;
      case "loading":
        toast.loading(msg, toastConfig);
        break;
      default:
        toast(msg, toastConfig);
    }
  }, [toastertype, msg, toastOptions]);

  return (
    <Toaster
    containerStyle={{
      position: "fixed", // Ensures the toast stays above everything
      top: 0,
      left: 0,
      width: "100%", // High value to ensure it’s above all other elements
    }}
    />
  );
};

export default Notification;


// Example usage:
// <Notification
//   toastertype="success"
//   msg="Success notification message!"
//   duration={4000}
//   position="bottom-left"
//   style={{ background: 'green', color: 'white', fontSize: '16px' }}
//   icon={<i className="fas fa-check-circle"></i>}
//   ariaDescription="This is a success toast"
//   className="success-toast"
//   iconTheme={{ primary: 'green', secondary: 'white' }}
// />