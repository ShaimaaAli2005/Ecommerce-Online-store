import api from '../api/axios';

// 1. الدالة الفردية لجلب تفاصيل منتج محدد
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data?.product || response.data?.data || response.data;
};

// 2. دالة جلب المنتجات مع الفلترة والترقيم
export const getProducts = async (params = {}) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const response = await api.get('/products', { params: cleanParams });
  return response.data;
};

// 3. جلب مراجعات وتقييمات المنتج
export const getProductReviews = async (id) => {
  const response = await api.get(`/products/${id}/reviews`);
  return response.data;
};

// 4. إضافة تقييم ومراجعة للمنتج
export const addProductReview = async (id, data) => {
  const response = await api.post(`/products/${id}/reviews`, data);
  return response.data;
};

// 5. التصدير الافتراضي الموحد لدعم أسلوبي الاستدعاء (Named & Default)
const productService = {
  getProducts,
  getProductById,
  getProductReviews,
  addProductReview,
};

export default productService;