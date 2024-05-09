import { createContext } from "react";

const LoginContext = createContext({ userId: '', setUserId: (userId: string) => { } });

export default LoginContext;
