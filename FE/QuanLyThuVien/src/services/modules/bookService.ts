import axiosClient from "../api/axiosClient";
import type {
    BookItem,
    ApiResponse,
} from "../../types/book";

export async function GetPopularBooks(): Promise<BookItem[] | ApiResponse<BookItem[]>> {
    const response = await axiosClient.get<BookItem[] | ApiResponse<BookItem[]>>('/sach/noi-bat');
    return response.data;
}

