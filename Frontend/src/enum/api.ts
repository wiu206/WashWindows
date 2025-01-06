const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

export const AUTH_URL = `${API_BASE_URL}${API_VERSION}/auth`;
export const USER_URL = `${API_BASE_URL}${API_VERSION}/user`;

export const auth_api = {
    login: `${AUTH_URL}/login`,
    register: `${AUTH_URL}/register`,
    logout: `${AUTH_URL}/logout`
} as const;

export const user_api = {
    getAllPoints: `${USER_URL}/getAllUserPoints`,
    updateUser: `${USER_URL}/updateByUserId`,
    updatePoints: `${USER_URL}/updatePoints`,
    deleteUser: `${USER_URL}/deleteByUserId`,
    updatePassword: `${USER_URL}/updatePassword`
} as const;