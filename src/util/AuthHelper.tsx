import { request, setAuthToken } from "./AxiosHelper";

export const refreshToken = () => {

    const userId = localStorage.getItem('userId');

    request(
        "POST",
        `/auth/refresh/${userId}`,
        {}
    )
        .then((response) => {
            setAuthToken(response?.data)
        }).catch((error) => {
            console.log(error);
        });
}