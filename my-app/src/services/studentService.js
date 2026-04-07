import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

export const getAllStudents = async () => {
  const response = await api.get(API_ENDPOINTS.STUDENTS);
  return response.data;
};

