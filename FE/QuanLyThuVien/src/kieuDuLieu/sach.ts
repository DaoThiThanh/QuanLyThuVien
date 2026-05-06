export interface BookItem {
    id: string;
    tenSach: string;
    hinhAnh: string;
    soLuongTon: number;
    soLuongMuon: number;
}
export interface CategoryItem {
    id: string
    tenDanhMuc: string
    icon: string
}
export interface NewBookItem {
    id: string;
    TenSach: string;
    HinhAnh: string;
    SoLuongTon: number;
    NamXuatBan: number;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface PaginatedBookItem {
    id: string;
    tenSach: string;
    hinhAnh: string;
    soLuongTon: number;
    tenDanhMuc: string;
    tenTacGia: string;
}

export interface PaginatedResponse<T> {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    items: T[];
}

export interface TacGiaItem {
    id: string;
    tenTacGia: string;
}

export interface NhaXuatBanItem {
    id: string;
    tenNXB: string;
}

export interface UpsertSachDto {
    tenSach: string;
    hinhAnh?: string;
    soLuongTon: number;
    danhMucId: string;
    tacGiaId: string;
    nxbId: string;
    namXuatBan: number;
    moTa?: string;
    isbn?: string;
}

export interface ItemGioSach {
    id: string;
    tenSach: string;
    tenTacGia: string;
    hinhAnh: string;
}
