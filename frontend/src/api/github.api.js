import clientAPI from './client';

export const createGitHubSnapshot = async ({repoUrl}) => {
    const response = await clientAPI.post('/github/snapshot', {repoUrl});
    return response.data;
};
