import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

if (
  roles &&
  !roles.some((role) =>
    user.roles.includes(`ROLE_${role}`)
  )
) {
  return <Navigate to="/login" />;
}

  return children;
}