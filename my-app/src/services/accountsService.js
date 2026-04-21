import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

export const getAllStudents = async () => {
  const response = await api.get(API_ENDPOINTS.STUDENTS);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.ACCOUNTS}${id}`);
  return response.data;
}
export const createStudent = async (studentData) => {
  const response = await api.post(API_ENDPOINTS.STUDENTS, studentData);
  return response.data;
}
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`${API_ENDPOINTS.STUDENTS}/${id}`, studentData);
  return response.data;
}
export const deleteStudent = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
  return response.data;
}

export const getAllTeachers = async () => {
  const response = await api.get(API_ENDPOINTS.TEACHERS);
  return response.data;
};

export const getTeacherById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.ACCOUNTS}${id}`);
  return response.data;
}
export const createTeacher = async (teacherData) => {
  const response = await api.post(API_ENDPOINTS.TEACHERS, teacherData);
  return response.data;
}
export const updateTeacher = async (id, teacherData) => {
  const response = await api.put(`${API_ENDPOINTS.TEACHERS}/${id}`, teacherData);
  return response.data;
}
export const deleteTeacher = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.TEACHERS}/${id}`);
  return response.data;
}

export const getAllAdmins = async () => {
  const response = await api.get(API_ENDPOINTS.ADMINS);
  return response.data;
};

export const getAdminById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.ADMINS}${id}`);
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await api.post(API_ENDPOINTS.ADMINS, adminData);
  return response.data;
};

export const updateAdmin = async (id, adminData) => {
  const response = await api.patch(`${API_ENDPOINTS.ACCOUNTS}${id}`, adminData);
  return response.data;
};

export const patchStudent = async (id, data) => {
  const response = await api.patch(`${API_ENDPOINTS.STUDENTS}/${id}`, data);
  return response.data;
};

export const patchTeacher = async (id, data) => {
  const response = await api.patch(`${API_ENDPOINTS.TEACHERS}${id}`, data);
  return response.data;
};

