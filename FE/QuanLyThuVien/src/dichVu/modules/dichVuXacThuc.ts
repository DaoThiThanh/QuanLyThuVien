import CauHinhApi from "../api/CauHinhApi";
import type {
    ApiResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from "../../kieuDuLieu/xacThuc";

export function getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}
export function getRole(): string | null {
    return localStorage.getItem('userRole') || sessionStorage.getItem('userRole')
}
export function getUserId(): string | null {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId')
}
export function getUserName(): string | null {
    return localStorage.getItem('userName') || sessionStorage.getItem('userName')
}
export function getEmail(): string | null {
    return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail')
}
export function setAuthData(data: { token: string, role: number, userId: string, userName?: string, userEmail?: string }, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', data.token);
    storage.setItem('userRole', data.role.toString());
    storage.setItem('userId', data.userId);
    if (data.userName !== undefined && data.userName !== null) {
        storage.setItem('userName', data.userName);
    }
    if (data.userEmail) {
        storage.setItem('userEmail', data.userEmail);
    }
}
export function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
}

// Helper giải mã JWT đơn giản
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export async function loginApi(payload: LoginRequest, remember: boolean = false): Promise<LoginResponse> {
    const response = await CauHinhApi.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    const data = response.data;
    if (!data.data) throw new Error(data.message ?? 'Đăng nhập thất bại');

    const respData = data.data as any;
    const token = respData.token || respData.Token;

    // Giải mã token để lấy thông tin (độ tin cậy cao hơn)
    const decoded = parseJwt(token);

    // Tìm role
    const userRole = decoded?.Role || decoded?.role || respData.user?.role || respData.role || respData.Role || 0;
    
    // Tìm ID
    const userId = decoded?.sub || decoded?.id || respData.user?.id || respData.userid || respData.userId || respData.UserId || '';
    
    // Tìm Tên (HoTen) - Ưu tiên từ Token, sau đó từ Response Body
    const userName = decoded?.HoTen || respData.HoTen || decoded?.hoten || respData.hoten || '';

    // Tìm Email
    const userEmail = decoded?.email || decoded?.Email || respData.email || respData.Email || '';

    setAuthData({
        token: token,
        role: Number(userRole),
        userId: userId,
        userName: userName,
        userEmail: userEmail
    }, remember);

    return data.data;
}

export async function registerApi(payload: RegisterRequest): Promise<any> {
    const response = await CauHinhApi.post<ApiResponse<any>>('/auth/register', payload);
    return response.data;
}
export interface ProfileData {
    id: string;
    hoTen: string;
    email: string;
    soDienThoai: string | null;
    vaiTro: number;
    trangThai: number;
    ngayTao: string;
}

export async function getProfileApi(userId: string): Promise<ProfileData> {
    const response = await CauHinhApi.get<ApiResponse<ProfileData>>(`/auth/profile/${userId}`);
    if (response.data.data) {
        return response.data.data;
    }
    throw new Error(response.data.message || 'Không thể lấy thông tin hồ sơ');
}

export async function changePasswordApi(payload: any): Promise<any> {
    const response = await CauHinhApi.post<ApiResponse<any>>('/auth/change-password', payload);
    return response.data;
}
