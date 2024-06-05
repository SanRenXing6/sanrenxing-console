import axios from 'axios';
import { backendEndpoint } from './EndpointHelper';

axios.defaults.baseURL = `https://${backendEndpoint}/api/v1`;
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
}

export const setAuthToken = (token: string) => {
    window.localStorage.setItem("auth_token", token);
}

export const request = async (method: string,
    url: string,
    data: any,
    headers?: any,
    responseType?: any
) => {
    const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers || { "Authorization": `Bearer ${getAuthToken()}` },
        ...responseType && { responseType: responseType }
    })
    return response;
}