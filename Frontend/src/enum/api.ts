const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

const AUTH_URL = `${API_BASE_URL}${API_VERSION}/auth`;
const USER_URL = `${API_BASE_URL}${API_VERSION}/user`;
const ADMIN_URL = `${API_BASE_URL}${API_VERSION}/admin`;

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

export const admin_api = {
    getAllUser: `${ADMIN_URL}/getAllUser`,
    resetUserPoints: `${ADMIN_URL}/resetUserPoints`,
    revokeUser: `${ADMIN_URL}/revokeUser`,
} as const;