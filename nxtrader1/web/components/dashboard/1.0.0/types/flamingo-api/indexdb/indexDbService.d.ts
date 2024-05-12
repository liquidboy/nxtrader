type OnUpgradeListener = (dbChangedEvent: IDBDatabase) => void;
declare const _default: {
    getObjectStore: typeof getObjectStore;
    isOfflineStorageEnabled: typeof isOfflineStorageEnabled;
    bootstrapOfflineStorage: typeof bootstrapOfflineStorage;
    registerOnUpgradeNeededListener: typeof registerOnUpgradeNeededListener;
};
export default _default;
declare function registerOnUpgradeNeededListener(listener: OnUpgradeListener): void;
declare function getObjectStore(objectStoreName: string): IDBObjectStore;
declare function isOfflineStorageEnabled(): boolean;
declare function bootstrapOfflineStorage(offlineStorage: any, runOtherBootstrapCallbacks: any): Promise<void>;
