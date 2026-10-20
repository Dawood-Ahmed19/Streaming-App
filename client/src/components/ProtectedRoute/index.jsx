import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) {
    return <p className="p-8 text-center text-muted">Loading...</p>;
  }
  return currentUser ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
