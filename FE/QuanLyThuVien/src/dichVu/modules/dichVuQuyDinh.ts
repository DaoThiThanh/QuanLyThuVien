import CauHinhApi from '../api/CauHinhApi';

export interface ThamSoQuyDinhDto {
    id: string;
    soSachMuonToiDa: number;
    soNgayMuonToiDa: number;
    phiPhatTreHanMoiNgay: number;
    ngayCapNhat: string;
}

export const getQuyDinh = async (): Promise<ThamSoQuyDinhDto> => {
    try {
        const response = await CauHinhApi.get('/quy-dinh');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy quy định:", error);
        return {
            id: '',
            soSachMuonToiDa: 3,
            soNgayMuonToiDa: 10,
            phiPhatTreHanMoiNgay: 5000,
            ngayCapNhat: new Date().toISOString()
        };
    }
};

export const updateQuyDinh = async (quyDinh: ThamSoQuyDinhDto): Promise<any> => {
    const response = await CauHinhApi.put('/quy-dinh', quyDinh);
    return response.data;
};
