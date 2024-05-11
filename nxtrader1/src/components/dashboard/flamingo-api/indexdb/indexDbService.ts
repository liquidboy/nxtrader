type OnUpgradeListener = (dbChangedEvent: IDBDatabase) => void;
interface OpenDbResult {
    dbUpgradeNeeded: boolean;
    openDbHandle: IDBDatabase
}

const OFFLINE_STORAGE_DB_NAME = "neo-flamingo-offline-storage";
const DB_VERSION = 1;

let offlineStorageAvailable = false;
const onUpgradeNeededListeners: OnUpgradeListener[] = [];
let _openDbHandle: IDBDatabase;

export default {
    getObjectStore,
    isOfflineStorageEnabled,
    bootstrapOfflineStorage,
    registerOnUpgradeNeededListener
};

function registerOnUpgradeNeededListener(listener: OnUpgradeListener) {
    onUpgradeNeededListeners.push(listener);
}

function getObjectStore(objectStoreName: string) {
    const transaction = _openDbHandle.transaction(objectStoreName, "readwrite");
    transaction.oncomplete = function () {
        // TODO do we need to do anything here? This function receives an event object.
    };
    return transaction.objectStore(objectStoreName);
}

function isOfflineStorageEnabled() {
    return offlineStorageAvailable;
}

async function bootstrapOfflineStorage(offlineStorage, runOtherBootstrapCallbacks) {
    offlineStorageAvailable = offlineStorage;

    if (!offlineStorageAvailable) {
        throw "[Offline Storage] Feature switch not enabled";
    }

    try {
        const {openDbHandle} = await openDatabase();
        _openDbHandle = openDbHandle;
        // if (dbUpgradeNeeded) upgradeDb();
        await runOtherBootstrapCallbacks();
    } catch (e) {
        offlineStorageAvailable = false;
        const reason = "[Offline Storage] Feature was enabled but failed to initialize databases";
        console.error(reason, e);
        throw reason;
    }
}

function openDatabase(): Promise<OpenDbResult> {
    return new Promise((resolve, reject) => {
        const openDbRequest = self.indexedDB.open(OFFLINE_STORAGE_DB_NAME, DB_VERSION);
        let dbUpgradeNeeded = false;

        openDbRequest.onsuccess = function () {
            resolve({dbUpgradeNeeded, openDbHandle: this.result});
        };
        openDbRequest.onerror = function (evt) {
            console.error("[Offline Storage] Could not open database", evt);
            reject(evt);
        };

        openDbRequest.onupgradeneeded = function () {
            onUpgradeNeededListeners.forEach(listener => {
                listener(this.result);
            });

            dbUpgradeNeeded = true;
        };
    });
}
