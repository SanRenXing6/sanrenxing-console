export const saveListToLocalStorage = (key: string, list: any[]) => {
    const jsonString = JSON.stringify(list);
    localStorage.setItem(key, jsonString);
}

export const loadListFromLocalStorage = (key: string): any[] => {
    const jsonString = localStorage.getItem(key);
    if (jsonString) {
        return JSON.parse(jsonString);
    }
    return [];
}