import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";


export const login = async (email, password) => {
  const response = await api.post(
    API_ENDPOINTS.LOGIN,
    {
      identifier: email,
      password: password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};


export const logout = async () => {
  await api.post(API_ENDPOINTS.LOGOUT);
};


export const getMe = async () => {
  const response = await api.get(API_ENDPOINTS.ME);
  return response.data; // { id, first_name, last_name, email, role }
};


export const refreshToken = async () => {
  await api.post(API_ENDPOINTS.REFRESH_TOKEN);
};


export const forgetPassword = async (email) => {
  const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, { email });
  return response.data;
};


export const resetPasswordConfirm = async (
  token,
  new_password,
  confirm_password,
) => {
  const response = await api.post(API_ENDPOINTS.RESET_PASSWORD_CONFIRM, {
    token,
    new_password: new_password,
    confirm_password: confirm_password,
  });
  return response.data;
};


export const changePassword = async (
  current_password,
  new_password,
  confirm_password,
) => {
  const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
    current_password: current_password,
    new_password: new_password,
    confirm_password: confirm_password,
  });
  return response.data;
};
