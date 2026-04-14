import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

export const getAllStudents = async () => {
  const response = await api.get(API_ENDPOINTS.STUDENTS);
  console.log("here from the fetch the students" , response)
  return response.data;
};

