import clientAPI from './client'

export const getReviewById = async (reviewId) => {
    const response = await clientAPI.get(`/review/${reviewId}`);
    return response.data;
}

export const getDashboardStats = async () => {
  const response = await clientAPI.get("/review/dashboard/stats");
  return response.data;
}

export const getUserReviews = async () => {
  const response = await clientAPI.get("/review/user?limit=${limit}");
  return response.data;
}