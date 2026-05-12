$f = 'd:\BTL_CongNgheWeb_DoAn3\QuanLyThuVien\FE\QuanLyThuVien\src\pages\TrangThuThu.tsx'
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Try LF version
$old_lf = "onClick={() => {`n                                      setSelectedPhieuMuon(item);`n                                      setShowLoanDetailModal(true);`n                                    }}"
$new_val = "onClick={() => handleViewDetail(item.id)}"

$r = $c.Replace($old_lf, $new_val)
if ($r -ne $c) {
    [System.IO.File]::WriteAllText($f, $r, [System.Text.Encoding]::UTF8)
    Write-Host "SUCCESS (LF)"
    exit 0
}

# Try CRLF version
$old_crlf = "onClick={() => {`r`n                                      setSelectedPhieuMuon(item);`r`n                                      setShowLoanDetailModal(true);`r`n                                    }}"
$r = $c.Replace($old_crlf, $new_val)
if ($r -ne $c) {
    [System.IO.File]::WriteAllText($f, $r, [System.Text.Encoding]::UTF8)
    Write-Host "SUCCESS (CRLF)"
    exit 0
}

Write-Host "FAILED - pattern not found"
