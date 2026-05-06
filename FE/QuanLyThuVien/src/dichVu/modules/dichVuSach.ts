import CauHinhApi from "../api/CauHinhApi";
import type {
    BookItem,
    ApiResponse,
    CategoryItem,
    NewBookItem,
    PaginatedResponse,
    PaginatedBookItem,
    UpsertSachDto,
    TacGiaItem,
    NhaXuatBanItem
} from "../../kieuDuLieu/sach";

export async function GetPopularBooks(): Promise<BookItem[] | ApiResponse<BookItem[]>> {
    const response = await CauHinhApi.get<BookItem[] | ApiResponse<BookItem[]>>('/sach/noi-bat');
    return response.data;
}
export async function GetCategories(): Promise<CategoryItem[] | ApiResponse<CategoryItem[]>> {
    const response = await CauHinhApi.get<CategoryItem[] | ApiResponse<CategoryItem[]>>('/danh-muc');
    return response.data;
}
export async function GetNewBooks(): Promise<NewBookItem[] | ApiResponse<NewBookItem[]>> {
    const response = await CauHinhApi.get<NewBookItem[] | ApiResponse<NewBookItem[]>>('/sach/moi-bo-sung');
    return response.data;
}
export async function GetDanhSachSach(page: number = 1, pageSize: number = 12): Promise<PaginatedResponse<PaginatedBookItem>> {
    const response = await CauHinhApi.get<PaginatedResponse<PaginatedBookItem>>(`/sach?page=${page}&pageSize=${pageSize}`);
    return response.data;
}
export async function GetBookById(id: string): Promise<any> {
    const response = await CauHinhApi.get<any>(`/sach/${id}`);
    return response.data;
}

export async function CreateBook(data: UpsertSachDto): Promise<any> {
    const response = await CauHinhApi.post('/sach', data);
    return response.data;
}

export async function UpdateBook(id: string, data: UpsertSachDto): Promise<any> {
    const response = await CauHinhApi.put(`/sach/${id}`, data);
    return response.data;
}

export async function DeleteBook(id: string): Promise<any> {
    const response = await CauHinhApi.delete(`/sach/${id}`);
    return response.data;
}

export async function GetTacGias(): Promise<TacGiaItem[]> {
    const response = await CauHinhApi.get<TacGiaItem[]>('/sach/tac-gia');
    return response.data;
}

export async function GetNhaXuatBans(): Promise<NhaXuatBanItem[]> {
    const response = await CauHinhApi.get<NhaXuatBanItem[]>('/sach/nha-xuat-ban');
    return response.data;
}
