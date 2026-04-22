import axiosClient from "../api/axiosClient";
import type {
    ApiResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from "../../types/auth";

export function getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}
export function getRole(): string | null {
    return localStorage.getItem('userRole') || sessionStorage.getItem('userRole')
}
export function getUserId(): string | null {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId')
}
export function setAuthData(data: { token: string, role: number, userId: string }, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', data.token);
    storage.setItem('userRole', data.role.toString());
    storage.setItem('userId', data.userId);
}
export function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
}
export async function loginApi(payload: LoginRequest, remember: boolean = false): Promise<LoginResponse> {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    const data = response.data;
    if (!data.data) throw new Error(data.message ?? 'Đăng nhập thất bại');

    const respData = data.data as any;

    // Fallback: Lấy role và id từ respData.user nếu có, nếu không thì lấy trực tiếp từ respData
    const userRole = respData.user?.role ?? respData.role ?? 0;
    const userId = respData.user?.id ?? respData.userid ?? respData.userId ?? respData.id ?? '';

    setAuthData({
        token: respData.token,
        role: userRole,
        userId: userId
    }, remember);

    return data.data;
}

export async function registerApi(payload: RegisterRequest): Promise<any> {
    const response = await axiosClient.post<ApiResponse<any>>('/auth/register', payload);
    return response.data;
}