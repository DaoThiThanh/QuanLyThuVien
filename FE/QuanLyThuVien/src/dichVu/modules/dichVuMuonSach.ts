import CauHinhApi from "../api/CauHinhApi";

export interface CreateYeuCauMuonRequest {
    docGiaId: string;
    ngayHenNhan?: string;
    dauSachIds: string[];
}

export interface YeuCauMuonDto {
    id: string;
    docGiaId: string;
    tenDocGia: string;
    ngayYeuCau: string;
    ngayHenNhan?: string;
    trangThai: number;
    tenCacSach?: string[];
    email?: string;
}

export const CreateYeuCauMuon = async (payload: CreateYeuCauMuonRequest) => {
    const response = await CauHinhApi.post('/yeu-cau-muon', payload);
    return response.data;
};

export const CreatePhieuMuon = async (payload: any) => {
    const response = await CauHinhApi.post('/phieu-muon', payload);
    return response.data;
};

export const GetYeuCauByDocGiaAsync = async (userId: string) => {
    const response = await CauHinhApi.get<YeuCauMuonDto[]>(`/yeu-cau-muon/user/${userId}`);
    return response.data;
};

export const GetAllYeuCauMuon = async (page: number = 1, pageSize: number = 10) => {
    const response = await CauHinhApi.get(`/yeu-cau-muon?page=${page}&pageSize=${pageSize}`);
    return response.data;
};

export const GetDanhSachPhieuMuon = async (page: number = 1, pageSize: number = 10, searchTerm: string = "", statusFilter: string = "all") => {
    const response = await CauHinhApi.get(`/phieu-muon?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&statusFilter=${statusFilter}`);
    return response.data;
};

export const GetPhieuMuonByUser = async (userId: string) => {
    const response = await CauHinhApi.get<any[]>(`/phieu-muon/user/${userId}`);
    return response.data;
};

export const GetPhieuMuonById = async (id: string) => {
    const response = await CauHinhApi.get(`/phieu-muon/${id}`);
    return response.data;
};

export const GetPhieuMuonQuaHan = async () => {
    const response = await CauHinhApi.get<any[]>('/phieu-muon/qua-han');
    return response.data;
};

export const DuyetYeuCauMuon = async (id: string) => {
    const response = await CauHinhApi.put(`/yeu-cau-muon/${id}/duyet`);
    return response.data;
};

export const TuChoiYeuCauMuon = async (id: string) => {
    const response = await CauHinhApi.put(`/yeu-cau-muon/${id}/tu-choi`);
    return response.data;
};
export const CheckBorrowingLimit = async (userId: string) => {
    const response = await CauHinhApi.get<{ 
        currentCount: number, 
        maxLimit: number, 
        canBorrowMore: number, 
        hasOverdue: boolean, 
        currentBookIds: string[],
        totalBorrowed: number
    }>(`/yeu-cau-muon/check-limit/${userId}`);
    return response.data;
};

export const ReturnBook = async (payload: { phieuMuonId: string, cuonSachId: string, tinhTrang: string }) => {
    const response = await CauHinhApi.post('/phieu-muon/return', payload);
    return response.data;
};
