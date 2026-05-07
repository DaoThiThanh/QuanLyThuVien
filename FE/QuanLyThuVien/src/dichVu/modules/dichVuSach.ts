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
export async function DeleteCategory(id: string): Promise<any> {
    const response = await CauHinhApi.delete(`/danh-muc/${id}`);
    return response.data;
}
export async function CreateCategory(name: string, icon?: string): Promise<any> {
    const response = await CauHinhApi.post('/danh-muc', { tenDanhMuc: name, icon: icon });
    return response.data;
}
export async function UpdateCategory(id: string, name: string, icon?: string): Promise<any> {
    const response = await CauHinhApi.put(`/danh-muc/${id}`, { tenDanhMuc: name, icon: icon });
    return response.data;
}
export async function GetNewBooks(): Promise<NewBookItem[] | ApiResponse<NewBookItem[]>> {
    const response = await CauHinhApi.get<NewBookItem[] | ApiResponse<NewBookItem[]>>('/sach/moi-bo-sung');
    return response.data;
}
export async function GetDanhSachSach(page: number = 1, pageSize: number = 12, searchTerm: string = ""): Promise<PaginatedResponse<PaginatedBookItem>> {
    const response = await CauHinhApi.get<PaginatedResponse<PaginatedBookItem>>(`/sach?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
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
export async function DeleteTacGia(id: string): Promise<any> {
    const response = await CauHinhApi.delete(`/sach/tac-gia/${id}`);
    return response.data;
}
export async function CreateTacGia(name: string): Promise<any> {
    const response = await CauHinhApi.post('/sach/tac-gia', { tenTacGia: name });
    return response.data;
}
export async function UpdateTacGia(id: string, name: string): Promise<any> {
    const response = await CauHinhApi.put(`/sach/tac-gia/${id}`, { tenTacGia: name });
    return response.data;
}

export async function GetNhaXuatBans(): Promise<NhaXuatBanItem[]> {
    const response = await CauHinhApi.get<NhaXuatBanItem[]>('/sach/nha-xuat-ban');
    return response.data;
}

export const GetCuonSachByBarcode = async (barcode: string) => {
    const response = await CauHinhApi.get(`/Sach/cuon-sach/barcode/${barcode}`);
    return response.data;
};

export const GetAvailableCopies = async (dauSachId: string) => {
    const response = await CauHinhApi.get<any[]>(`/Sach/cuon-sach/available/${dauSachId}`);
    return response.data;
};

export const GetPagedCuonSachs = async (page: number = 1, pageSize: number = 12, searchTerm: string = "") => {
    const response = await CauHinhApi.get(`/Sach/cuon-sach/paged?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
    return response.data;
};

export const UpdateCuonSach = async (id: string, data: { maVach: string, tinhTrang: string, trangThaiMuon: number }) => {
    const response = await CauHinhApi.put(`/Sach/cuon-sach/${id}`, data);
    return response.data;
};

export const DeleteCuonSach = async (id: string) => {
    const response = await CauHinhApi.delete(`/Sach/cuon-sach/${id}`);
    return response.data;
};

export const CreateCuonSach = async (data: { dauSachId: string, maVach: string }) => {
    const response = await CauHinhApi.post('/Sach/cuon-sach', data);
    return response.data;
};
