import clinetAPI from "./client";

export const uploadRepoZip = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await clinetAPI.post('/repo/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    return response.data;
};

export const createReview = async (snapshotId) => {
    const response = await clinetAPI.post('/review/create', {snapShotId: snapshotId});
    return response.data;
}