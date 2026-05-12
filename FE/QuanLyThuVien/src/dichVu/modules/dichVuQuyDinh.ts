import CauHinhApi from '../api/CauHinhApi';

export interface ThamSoQuyDinhDto {
    id: string;
    soSachMuonToiDa: number;
    soNgayMuonToiDa: number;
    phiPhatTreHanMoiNgay: number;
    phiPhatHongNhe: number;
    phiPhatHongNang: number;
    phiPhatMatSach: number;
    ngayCapNhat: string;
}

export const getQuyDinh = async (): Promise<ThamSoQuyDinhDto> => {
    try {
        const response = await CauHinhApi.get('/quy-dinh');
        // Handle both direct data and wrapped data
        const data = response.data.data ? response.data.data : response.data;
        
        return {
            id: data.id || '',
            soSachMuonToiDa: data.soSachMuonToiDa || 3,
            soNgayMuonToiDa: data.soNgayMuonToiDa || 10,
            phiPhatTreHanMoiNgay: data.phiPhatTreHanMoiNgay || 5000,
            phiPhatHongNhe: data.phiPhatHongNhe || 20000,
            phiPhatHongNang: data.phiPhatHongNang || 50000,
            phiPhatMatSach: data.phiPhatMatSach || 100000,
            ngayCapNhat: data.ngayCapNhat || new Date().toISOString()
        };
    } catch (error) {
        console.error("Lỗi khi lấy quy định:", error);
        return {
            id: '',
            soSachMuonToiDa: 3,
            soNgayMuonToiDa: 10,
            phiPhatTreHanMoiNgay: 5000,
            phiPhatHongNhe: 20000,
            phiPhatHongNang: 50000,
            phiPhatMatSach: 100000,
            ngayCapNhat: new Date().toISOString()
        };
    }
};

export const updateQuyDinh = async (quyDinh: ThamSoQuyDinhDto): Promise<any> => {
    const response = await CauHinhApi.put('/quy-dinh', quyDinh);
    return response.data;
};
