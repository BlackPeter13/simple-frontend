export function getCachedData(key, ttl) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { timestamp, data } = JSON.parse(item);
    const age = Date.now() - timestamp;
    return age < ttl ? data : null;
}

export function setCachedData(key, data) {
    const item = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(key, JSON.stringify(item));
}
