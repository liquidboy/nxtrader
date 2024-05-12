var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const OFFLINE_STORAGE_DB_NAME = "neo-flamingo-offline-storage";
    const DB_VERSION = 1;
    let offlineStorageAvailable = false;
    const onUpgradeNeededListeners = [];
    let _openDbHandle;
    exports.default = {
        getObjectStore,
        isOfflineStorageEnabled,
        bootstrapOfflineStorage,
        registerOnUpgradeNeededListener
    };
    function registerOnUpgradeNeededListener(listener) {
        onUpgradeNeededListeners.push(listener);
    }
    function getObjectStore(objectStoreName) {
        const transaction = _openDbHandle.transaction(objectStoreName, "readwrite");
        transaction.oncomplete = function () {
        };
        return transaction.objectStore(objectStoreName);
    }
    function isOfflineStorageEnabled() {
        return offlineStorageAvailable;
    }
    function bootstrapOfflineStorage(offlineStorage, runOtherBootstrapCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            offlineStorageAvailable = offlineStorage;
            if (!offlineStorageAvailable) {
                throw "[Offline Storage] Feature switch not enabled";
            }
            try {
                const { openDbHandle } = yield openDatabase();
                _openDbHandle = openDbHandle;
                yield runOtherBootstrapCallbacks();
            }
            catch (e) {
                offlineStorageAvailable = false;
                const reason = "[Offline Storage] Feature was enabled but failed to initialize databases";
                console.error(reason, e);
                throw reason;
            }
        });
    }
    function openDatabase() {
        return new Promise((resolve, reject) => {
            const openDbRequest = self.indexedDB.open(OFFLINE_STORAGE_DB_NAME, DB_VERSION);
            let dbUpgradeNeeded = false;
            openDbRequest.onsuccess = function () {
                resolve({ dbUpgradeNeeded, openDbHandle: this.result });
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
});
