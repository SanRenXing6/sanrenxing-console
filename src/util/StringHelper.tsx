export const checkIfStringEmpty = (string: string) => {
    return !string && string?.length === 0;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const stringToBoolean = (str: string) => {
    if (typeof str !== 'string') {
        throw new TypeError('Input should be a string');
    }
    return str.toLowerCase() === 'true';
}