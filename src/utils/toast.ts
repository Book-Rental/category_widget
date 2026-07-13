type ToastType = "success" | "error" | "warning" | "info";

export const showToast = (
  message: string,
  type: ToastType = "success"
) => {
  window.dispatchEvent(
    new CustomEvent("app-toast-notification", {
      detail: {
        message,
        type,
      },
    })
  );
};