import axiosClient from "../api/axiosClient";

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
}

export const CreateYeuCauMuon = async (payload: CreateYeuCauMuonRequest) => {
    const response = await axiosClient.post('/yeu-cau-muon', payload);
    return response.data;
};

export const GetYeuCauByUser = async (userId: string) => {
    const response = await axiosClient.get<YeuCauMuonDto[]>(`/yeu-cau-muon/user/${userId}`);
    return response.data;
};

export const GetAllYeuCauMuon = async () => {
    const response = await axiosClient.get<YeuCauMuonDto[]>('/yeu-cau-muon');
    return response.data;
};

export const GetDanhSachPhieuMuon = async (page: number = 1, pageSize: number = 10) => {
    const response = await axiosClient.get(`/phieu-muon?page=${page}&pageSize=${pageSize}`);
    return response.data;
};

export const GetPhieuMuonQuaHan = async () => {
    const response = await axiosClient.get<any[]>('/phieu-muon/qua-han');
    return response.data;
};
