import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api/api";
import { Category, Product } from "../types/types";
import { SlidersHorizontal, X, } from "lucide-react";
import { Container } from "../components/Container";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
const selectedCategories = useMemo(() => {
  const raw = searchParams.get("categories");
  return raw ? raw.split(",").map(Number) : [];
}, [searchParams]);

  const limit = 9;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    fetchCategories();
  }, []);



  const fetchCategories = async () => {
    try {
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

const loadProducts = useCallback(async () => {
  setIsLoadingProducts(true);

  try {
    const data = await api.getProducts({
      categories: selectedCategories,
      page,
      limit,
    });

    setProducts(data);

    const allProducts = await api.getProducts({
      categories: selectedCategories,
      page: 1,
      limit: 999,
    });

    setTotalCount(allProducts.length);
  } catch (err) {
    console.error("Error loading products:", err);
  } finally {
    setIsLoadingProducts(false);
  }
}, [selectedCategories, page]);


useEffect(() => {
  loadProducts();
}, [loadProducts]);

  const toggleCategory = (id: number) => {
    let updated = [...selectedCategories];

    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id);
    } else {
      updated.push(id);
    }

    setSearchParams({
      categories: updated.join(","),
      page: "1",
    });
  };

  const clearAllFilters = () => {
    setSearchParams({
      categories: "",
      page: "1",
    });
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({
      categories: selectedCategories.join(","),
      page: String(newPage),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Container className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Shop Our Collection
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing products at great prices
          </p>

        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filters & Sorting</span>
            {(selectedCategories.length > 0) && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`
            lg:block lg:w-80 flex-shrink-0
            ${showFilters ? 'block' : 'hidden'}
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
            bg-white lg:bg-transparent
            p-6 lg:p-0
            overflow-y-auto lg:overflow-visible
            shadow-xl lg:shadow-none
          `}>
            <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
              <button
                aria-label="close"
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>


            {/* Categories Filter */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Categories</h3>
              {isLoadingCategories ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
             <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scroll">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <input
                        data-testid={`category-${category.id}`}
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 flex-1">{category.name}</span>
                      {selectedCategories.includes(category.id) && (
                        <X
                          className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(category.id);
                          }}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0) && (
              <div className="mt-6 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Active Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">

                  {selectedCategories.map(catId => (
                    <span key={catId} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-full flex items-center gap-2">
                      {getCategoryName(catId)}
                      <button
                        aria-label="close"
                        onClick={() => toggleCategory(catId)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Close button for mobile */}
            <div className="lg:hidden mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg mb-4">No products found</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>


              </>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
           data-testid="prev-page"
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className={`px-5 py-2.5 rounded-lg border font-medium transition-all duration-200
      ${page === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
              }`}
          >
            Prev
          </button>

          <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              Page <span className="font-bold">{page}</span> of{" "}
              <span className="font-bold">{totalPages || 1}</span>
            </span>
          </div>

          <button
          data-testid="next-page"
            onClick={() => changePage(page + 1)}
            disabled={page >= totalPages}
            className={`px-5 py-2.5 rounded-lg border font-medium transition-all duration-200
      ${page >= totalPages
                ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
              }`}
          >
            Next
          </button>
        </div>
      </Container>




      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}