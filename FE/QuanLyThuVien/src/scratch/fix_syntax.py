
import sys

path = r'd:\BTL_CongNgheWeb_DoAn3\QuanLyThuVien\FE\QuanLyThuVien\src\pages\TrangThuThu.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines are 1-indexed, so index 610, 611, 612 (0-indexed) are 611, 612, 613
# But wait, let's look for the patterns to be safe
new_lines = []
for i, line in enumerate(lines):
    # Skip lines 611, 612, 613 (0-indexed: 610, 611, 612)
    if i in [610, 611, 612]:
        if '</div>' in line or ')}' in line or line.strip() == '':
            continue
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fixed")
