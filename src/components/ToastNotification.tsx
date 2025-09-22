interface ToastNotificationProps {
  show: boolean;
  message: string;
}

export default function ToastNotification({ show, message }: ToastNotificationProps) {
  return (
    <div className={`toast-notification ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
}