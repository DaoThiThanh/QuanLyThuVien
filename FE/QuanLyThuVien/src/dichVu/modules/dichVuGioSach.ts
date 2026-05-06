
import type { ItemGioSach } from "../../kieuDuLieu/sach";


const KEY_GIO_SACH = 'library_borrow_cart';

export function getGioSach(): ItemGioSach[] {
    const data = localStorage.getItem(KEY_GIO_SACH);
    return data ? JSON.parse(data) : [];
}

export function themVaoGioSach(item: ItemGioSach) {
    const current = getGioSach();
    if (current.find(i => i.id === item.id)) return;
    current.push(item);
    localStorage.setItem(KEY_GIO_SACH, JSON.stringify(current));
    // Phát event để các component khác biết
    window.dispatchEvent(new Event('cart-updated'));
}

export function xoaKhoiGioSach(id: string) {
    let current = getGioSach();
    current = current.filter(i => i.id !== id);
    localStorage.setItem(KEY_GIO_SACH, JSON.stringify(current));
    window.dispatchEvent(new Event('cart-updated'));
}

export function xoaHetGioSach() {
    localStorage.removeItem(KEY_GIO_SACH);
    window.dispatchEvent(new Event('cart-updated'));
}

export function getSoLuongGioSach(): number {
    return getGioSach().length;
}
