import api from "./axiosInstance.js";

/**
 * Fetches personalized book recommendations for the authenticated student.
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=35]
 * @param {number} [params.offset]
 * @returns {Promise<{ recommendations: Array, page: number, limit: number, total: number, strategy: string }>}
 */
export const getPersonalizedRecommendations = async ({ page = 1, limit = 35, offset } = {}) => {
  const params = { page, limit };
  if (offset !== undefined && offset !== null) {
    params.offset = offset;
  }
  const response = await api.get("/recommendations", {
    params,
    withCredentials: true,
  });
  return response.data;
};

/**
 * Fetches similar books for a given book ID based on semantic vector similarity.
 * @param {number|string} bookId
 * @param {Object} [options]
 * @param {number} [options.limit=30]
 * @param {number} [options.page=1]
 * @param {number} [options.offset]
 * @returns {Promise<{ sourceBookId: number|string, recommendations: Array, total: number, strategy: string }>}
 */
export const getSimilarBooks = async (bookId, { limit = 30, page = 1, offset } = {}) => {
  const params = { limit, page };
  if (offset !== undefined && offset !== null) {
    params.offset = offset;
  }
  const response = await api.get(`/recommendations/books/${bookId}/similar`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

/**
 * Fetches the recommendation model health diagnostics.
 * @returns {Promise<Object>}
 */
export const getRecommendationModelHealth = async () => {
  const response = await api.get("/recommendations/health", {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Admin: Triggers a catalog vector synchronization with MySQL.
 * @param {Object} [options]
 * @param {boolean} [options.force=false]
 * @returns {Promise<Object>}
 */
export const triggerCatalogVectorSync = async ({ force = false } = {}) => {
  const response = await api.post(
    "/admin/recommendations/sync",
    { force },
    { withCredentials: true }
  );
  return response.data;
};
