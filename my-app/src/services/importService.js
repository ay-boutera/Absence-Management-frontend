import api from "./api";
import { API_ENDPOINTS } from "@/lib/constants";

const IMPORT_RESPONSE_STATUS = new Set([200, 201, 400, 422]);

const postImportFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    validateStatus: (status) => IMPORT_RESPONSE_STATUS.has(status),
  });

  return { data: response.data, status: response.status };
};

export const importStudents = async (file) => {
  return postImportFile(API_ENDPOINTS.IMPORT_STUDENTS, file);
};

export const importTeachers = async (file) => {
  return postImportFile(API_ENDPOINTS.IMPORT_TEACHERS, file);
};

export const importTimetable = async (file) => {
  return postImportFile(API_ENDPOINTS.IMPORT_TIMETABLE, file);
};

export const getImportExportHistory = async ({
  page = 1,
  pageSize = 20,
} = {}) => {
  const response = await api.get(API_ENDPOINTS.IMPORT_EXPORT_HISTORY, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return response.data;
};
