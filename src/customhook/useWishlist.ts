import { Product } from "../types/types";

const STORAGE_KEY = "wishList";

export const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
};

export const toggleWishlist = (product: Product) => {
    const items = getWishlist();

    const exists = items.some((item: any) => item.id === product.id);

    const updated = exists
        ? items.filter((item: any) => item.id !== product.id)
        : [...items, product];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return updated;
};

export const removeWishlistItem = (id: number) => {
    const items = getWishlist();

    const updated = items.filter((item: any) => item.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return updated;
};