export const checkIfStringEmpty = (string: string) => {
    return string && string?.length === 0;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}