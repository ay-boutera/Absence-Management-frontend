export function formatDate(date) {
  return new Date(date).toLocaleString();
}

export function getRoleRedirect(role) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/login";
}