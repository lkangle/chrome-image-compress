function getStorage(key) {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    try {
        return JSON.parse(value);
        // eslint-disable-next-line no-empty
    } catch { }
    return null;
}

function setStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        // eslint-disable-next-line no-empty
    } catch { }
}

const inChrome = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

export const storage = {
    async setItem(key: string, value: any) {
        if (inChrome) {
            await chrome.storage.local.set({
                [key]: value
            });
        } else {
            setStorage(key, value);
        }
    },
    async getItem<T>(key: string): Promise<T> {
        if (inChrome) {
            let o = await chrome.storage.local.get(key)
            return o?.[key]
        } else {
            return Promise.resolve(getStorage(key));
        }
    }
}