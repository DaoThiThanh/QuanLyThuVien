
const fs = require('fs');
const path = 'd:\\BTL_CongNgheWeb_DoAn3\\QuanLyThuVien\\FE\\QuanLyThuVien\\src\\pages\\TrangThuThu.tsx';
let content = fs.readFileSync(path, 'utf8').split('\n');

// Remove lines 611, 612, 613 (0-indexed: 610, 611, 612)
// Be careful with line indices
content.splice(610, 3);

fs.writeFileSync(path, content.join('\n'), 'utf8');
console.log('Fixed');
