import { refreshToken } from "./AuthHelper";

export const dealWithResponseError = (error: any) => {
    if (error?.message?.includes("403")) {
        refreshToken();
    } else {
        console.error(error?.message);
    }
}