export const getPortalAuthToken = () =>
  localStorage.getItem("afriwaid_auth_token") || sessionStorage.getItem("afriwaid_auth_token") || "";

export const getPortalAuthHeaders = (): HeadersInit => {
  const token = getPortalAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};