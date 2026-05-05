import axiosClient from "../api/axiosClient";
import type {
    BookItem,
    ApiResponse,
    CategoryItem,
    NewBookItem,
    PaginatedResponse,
    PaginatedBookItem
} from "../../types/book";

export async function GetPopularBooks(): Promise<BookItem[] | ApiResponse<BookItem[]>> {
    const response = await axiosClient.get<BookItem[] | ApiResponse<BookItem[]>>('/sach/noi-bat');
    return response.data;
}
export async function GetCategories(): Promise<CategoryItem[] | ApiResponse<CategoryItem[]>> {
    const response = await axiosClient.get<CategoryItem[] | ApiResponse<CategoryItem[]>>('/danh-muc');
    return response.data;
}
export async function GetNewBooks(): Promise<NewBookItem[] | ApiResponse<NewBookItem[]>> {
    const response = await axiosClient.get<NewBookItem[] | ApiResponse<NewBookItem[]>>('/sach/moi-bo-sung');
    return response.data;
}
export async function GetDanhSachSach(page: number = 1, pageSize: number = 12): Promise<PaginatedResponse<PaginatedBookItem>> {
    const response = await axiosClient.get<PaginatedResponse<PaginatedBookItem>>(`/sach?page=${page}&pageSize=${pageSize}`);
    return response.data;
}
export async function GetBookById(id: string): Promise<any> {
    const response = await axiosClient.get<any>(`/sach/${id}`);
    return response.data;
}
