import { createContext } from "react";

const LoginContext = createContext({
    userId: '', setUserId: (userId: string) => { },
    profileId: '', setProfileId: (profileId: string) => { },
    imageId: '', setImageId: (imageId: string) => { },
});

export default LoginContext;
