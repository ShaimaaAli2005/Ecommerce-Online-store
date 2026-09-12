import api from '../api/axios'; // أو حسب ملف axios instance الموجود بمشروعك

const productService = {
  getProducts: async (params = {}) => {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/products', { params: cleanParams });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export default productService;