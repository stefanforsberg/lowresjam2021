const storageKey = "saveState";

function save(level, state) {
    const currentState = load();

    currentState[level] = state;

    window.localStorage.setItem(storageKey, JSON.stringify(currentState));
}

function load() {
    const storedData = window.localStorage.getItem(storageKey);

    if(storedData) {
        return JSON.parse(storedData);
    }

    return {};
}

export { save, load }