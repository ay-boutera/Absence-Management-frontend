
export const CONFIG = {
  API_URL: "/api"
};

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
};


export const STATUSES = {
  ACTIVE: "active",
  DISABLED: "disabled",
};


export const TOKEN = {
  ACCESS_EXPIRY: 15 * 60 * 1000, // 15 minutes in ms
  REFRESH_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  REFRESH_INTERVAL: 14 * 60 * 1000, // refresh every 14 min
  INACTIVITY_LIMIT: 30 * 60 * 1000, // auto logout after 30 min
};


export const ROLE_ROUTES = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.TEACHER]: "/teacher",
};

export const API_ENDPOINTS = {
  LOGIN: "/v1/auth/login",
  LOGOUT: "/v1/auth/logout",
  REFRESH_TOKEN: "/v1/auth/refresh",
  RESET_PASSWORD: "/v1/auth/reset-password",
  RESET_PASSWORD_CONFIRM: "/v1/auth/reset-password/confirm",
  CHANGE_PASSWORD: "/v1/auth/change-password",
  USERS: "/v1/users/",
  ME: "/v1/auth/me",
  GOOGLE_AUTH: "/v1/auth/google",
  STUDENTS: "/v1/accounts/students",
  TEACHERS: "/v1/accounts/teachers/",
  ADMINS: "/v1/accounts/admins/",
  ACCOUNTS: "/v1/accounts/",
  USER_ME: "/v1/accounts/me",
  IMPORT_STUDENTS: "/v1/import/students",
  IMPORT_TEACHERS: "/v1/teachers/import-csv",
  IMPORT_SESSIONS: "/v1/import/planning",
  IMPORT_EXPORT_HISTORY: "/v1/import-export/history",
};




export const CSV_SCHEMAS = {
  // matches selectedOption === 0 in the import page
  students: {
    required: ["matricule", "nom", "prenom", "email", "filiere", "niveau", "groupe"],
    optional: [],                          // columns allowed but not mandatory
    separator: ",",                        // expected CSV separator
    label: "List of students",
  },
  
  // matches selectedOption === 1
  teachers: {
    required: ["id_enseignant", "nom", "prenom", "email"],
    optional: ["grade", "departement"],
    separator: ",",
    label: "List of teachers",
  },
 
  // matches selectedOption === 2
  timetable: {
    required: [
      "year",
      "semester",
      "day",
      "time_start",
      "time_end",
      "type",
      "subject",
      "teacher",
      "room",
    ],
    // section OR speciality must be present — handled as a special rule in the validator
    optional: ["section", "speciality", "group"],
    separator: ",",
    label: "Session planning",
  },
};

export const IMPORT_TYPE_TO_SCHEMA = {
  0: "students",
  1: "teachers",
  2: "timetable",
};

export const STUDENT_STATUS = {
  SAFE: "Safe",
  EXCLU: "Exclu",
};
export const STUDENT_STATUS_STYLES = {
  [STUDENT_STATUS.SAFE]: {
    background: "#dcfce7",   // light green
    color: "#15803d",        // dark green text
  },
  [STUDENT_STATUS.EXCLU]: {
    background: "#fee2e2",   // light red
    color: "#b91c1c",        // dark red text
  },
};