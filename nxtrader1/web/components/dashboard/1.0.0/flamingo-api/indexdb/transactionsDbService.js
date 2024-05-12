var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./indexDbService", "./indexDbErrorHandling"], function (require, exports, indexDbService_1, indexDbErrorHandling_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const WATCHLIST_STORE = "watchlist";
    let RECORD_VERSION = 2;
    indexDbService_1.default.registerOnUpgradeNeededListener(result => onUpgradeNeeded(result));
    exports.default = {
        setGeneratedArtifactVersion,
        storeTransaction,
        getTransactions,
        getAllTransactions,
        deleteById,
    };
    function onUpgradeNeeded(result) {
        console.log("transactionsDbService > onUpgradeNeeded");
        const objectStores = result.objectStoreNames;
        let store;
        if (!objectStores.contains(WATCHLIST_STORE)) {
            store = result.createObjectStore(WATCHLIST_STORE, { keyPath: "id" });
            store.createIndex("idIndex", "id", { unique: true, multiEntry: false });
            store.createIndex("symbolIndex", "symbol", { unique: false, multiEntry: false });
        }
    }
    function setGeneratedArtifactVersion(version) {
        RECORD_VERSION = version;
    }
    function storeTransaction(transaction, purchaseCostUsdt, goalUsdt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield addTransactionToDb(transaction, purchaseCostUsdt, goalUsdt);
        });
    }
    function getTransactions(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getTransactionsFromDb(symbol);
        });
    }
    function getAllTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAllTransactionsFromDb();
        });
    }
    function deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const modelStore = indexDbService_1.default.getObjectStore(WATCHLIST_STORE);
                const index = modelStore.index("idIndex");
                const cursor = index.openKeyCursor(id);
                cursor.onsuccess = function () {
                    const cur = cursor.result;
                    if (cur) {
                        modelStore.delete(cur.primaryKey);
                        cur.continue();
                    }
                    else {
                        resolve();
                    }
                };
                cursor.onerror = function (errorEvent) {
                    reject(errorEvent.target.errorCode);
                };
            });
        });
    }
    function addTransactionToDb(transaction, purchaseCostUsdt, goalUsdt) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let modelRecord = {
                    block_time: transaction.block_time,
                    id: transaction.id,
                    size: transaction.size,
                    txid: transaction.txid,
                    value: transaction.value,
                    net_fee: transaction.net_fee,
                    asset_id: transaction.asset_id,
                    symbol: transaction.symbol,
                    from: transaction.from,
                    to: transaction.to,
                    type: transaction.type,
                    purchaseCostUsdt: purchaseCostUsdt,
                    goalUsdt: goalUsdt,
                    recordVersion: RECORD_VERSION,
                    createdOn: new Date().toISOString()
                };
                const modelStore = indexDbService_1.default.getObjectStore(WATCHLIST_STORE);
                const modelRequest = modelStore.put(modelRecord);
                modelRecord = null;
                modelRequest.onsuccess = function () {
                    resolve();
                };
                modelRequest.onerror = function (errorEvent) {
                    reject((0, indexDbErrorHandling_1.extractErrorAsString)(`addTransactionToDb indexdb error id=${transaction.id}`, errorEvent));
                };
            });
        });
    }
    function getTransactionsFromDb(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const store = indexDbService_1.default.getObjectStore(WATCHLIST_STORE);
                const symbolIndex = store.index("symbolIndex");
                const requestHandle = symbolIndex.getAll(symbol);
                requestHandle.onsuccess = function (successEvent) {
                    if (typeof successEvent.target.result === "undefined") {
                        reject();
                        return;
                    }
                    const storedRecord = successEvent.target.result;
                    resolve(storedRecord);
                };
                requestHandle.onerror = function (errorEvent) {
                    reject((0, indexDbErrorHandling_1.extractErrorAsString)(`getTransactionsFromDb indexdb error`, errorEvent));
                };
            });
        });
    }
    function getAllTransactionsFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const store = indexDbService_1.default.getObjectStore(WATCHLIST_STORE);
                const requestHandle = store.getAll();
                requestHandle.onsuccess = function (successEvent) {
                    if (typeof successEvent.target.result === "undefined") {
                        reject();
                        return;
                    }
                    const storedRecord = successEvent.target.result;
                    resolve(storedRecord);
                };
                requestHandle.onerror = function (errorEvent) {
                    reject((0, indexDbErrorHandling_1.extractErrorAsString)(`getTransactionsFromDb indexdb error`, errorEvent));
                };
            });
        });
    }
});
