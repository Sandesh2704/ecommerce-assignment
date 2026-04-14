import { Product, Category } from "../types/types";

type ProductFilters = {
  categories?: number[];
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
};

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

const api = {
  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  getProducts: async ({
    categories = [],
    page = 1,
    limit = 12,
    sort = "asc",
  }: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();

    if (categories.length > 0) {
      params.set("categoryId", categories.join(","));
    }

    params.set("offset", String((page - 1) * limit));
    params.set("limit", String(limit));

    const response = await fetch(
      `${API_BASE_URL}/products?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    let data: Product[] = await response.json();

    if (sort === "asc") {
      data.sort((a, b) => a.price - b.price);
    } else {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

  getProductsByCategory: async (
    categoryId: number
  ): Promise<Product[]> => {
    const response = await fetch(
      `${API_BASE_URL}/products/?categoryId=${categoryId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category products");
    }

    return response.json();
  },
};

export default api;