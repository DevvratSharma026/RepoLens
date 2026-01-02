import clientAPI from './client'

export const getReviewById = async (reviewId) => {
    const response = await clientAPI.get(`/review/${reviewId}`);
    return response.data;
}