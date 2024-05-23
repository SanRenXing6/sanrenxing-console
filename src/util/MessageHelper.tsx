export const addItemToMessageList = (key: string, message: string) => {
    const currentList: string[] = loadMessageList(key) || [];
    const newList = currentList.concat(message);
    localStorage.setItem(key, JSON.stringify(newList));
}

export const loadMessageList = (key: string): any[] => {
    const jsonString = localStorage.getItem(key);
    if (jsonString) {
        return JSON.parse(jsonString);
    }
    return [];
}
