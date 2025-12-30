import clientAPI from './client';

export const login = async ({email, password}) => {
    const response = await clientAPI.post('/auth/login', {email, password});
    return response.data;
};

export const signup = async ({firstName, lastName, email, password, confirmPassword}) => {
    const response = await clientAPI.post('/auth/signup', {firstName, lastName, email, password, confirmPassword});
    return response.data;
};

export const verifyOtp = async ({email, code}) => {
    const response = await clientAPI.post('/auth/verify', {email, code});
    return response.data;
}