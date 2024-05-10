import { createContext } from "react";

const LoginContext = createContext({
    userId: '', setUserId: (__: string) => { },
    profileId: '', setProfileId: (__: string) => { },
    imageUrl: '', setImageUrl: (__: string) => { },
});

export default LoginContext;
