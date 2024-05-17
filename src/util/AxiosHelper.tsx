import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // local
// axios.defaults.baseURL = 'https://san-ren-xing-6141e43803cc.herokuapp.com/api/v1' // Heroku
axios.defaults.baseURL = 'http://1.12.223.110:8080/api/v1' //Tecent Cloud
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