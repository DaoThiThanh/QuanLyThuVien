export interface BookItem {
    id: string;
    tenSach: string;
    hinhAnh: string;
    soLuongTon: number;
    soLuongMuon: number;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}