import { useFavorites } from "../context/FavoritesContext";
import { CheckCircle, Info, Sparkles } from "lucide-react";

const ToastNotification = () => {
  const { toasts } = useFavorites();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="cinema-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="cinema-toast">
          {toast.type === "success" ? (
            <Sparkles size={18} className="text-warning" />
          ) : (
            <Info size={18} className="text-info" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
