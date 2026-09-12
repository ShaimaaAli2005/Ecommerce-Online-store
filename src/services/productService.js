import axios from 'axios';

const API_URL = 'https://e-commerce-api-3wara.vercel.app';

// 1. الدالة الفردية التي يحتاجها الزملاء في صفحة ProductDetails
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data.product || response.data;
};

// 2. دالة جلب المنتجات مع الفلترة لصفحة المتجر Shop
export const getProducts = async (params = {}) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const response = await axios.get(`${API_URL}/products`, { params: cleanParams });
  return response.data;
};

// 3. التصدير الافتراضي لدعم استدعاء productService.getProducts في صفحة Shop
const productService = {
  getProducts,
  getProductById,
};

export default productService;