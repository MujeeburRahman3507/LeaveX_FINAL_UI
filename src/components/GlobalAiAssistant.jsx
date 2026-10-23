import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FloatingAiLeaveAssistant from "./FloatingAiLeaveAssistant";
import ManagerAiAssistant from "./ManagerAiAssistant";
import AdminAiAssistant from "./AdminAiAssistant";

// pages where the assistant must not appear
const HIDDEN_ON = [
  "/",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/change-password",
  "/leave-action",
];

/**
 * One floating AI assistant for every logged-in screen.
 * Admin -> AdminAiAssistant, Manager -> ManagerAiAssistant,
 * Employee -> FloatingAiLeaveAssistant.
 */
export default function GlobalAiAssistant() {
  const { user, hasRole } = useAuth();
  const { pathname } = useLocation();

  if (!user || HIDDEN_ON.includes(pathname)) return null;

  if (hasRole("ADMIN")) return <AdminAiAssistant />;
  if (hasRole("MANAGER")) return <ManagerAiAssistant />;
  return <FloatingAiLeaveAssistant />;
}
