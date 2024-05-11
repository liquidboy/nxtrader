import IndexDbService from "./indexDbService";
import {extractErrorAsString} from "./indexDbErrorHandling";
import { Transaction } from "dashboard/wallet-manager/wallet-lib";

export interface StoredTransactionRecord {
    recordVersion: number;
    createdOn: string;

    block_time: number;
    id: number;
    size: number;
    txid: string;
    value: any;
    net_fee: any;
    asset_id: string;
    symbol: string;
    from: string[];
    to: string[];
    type: 'sent' | 'received';

    purchaseCostUsdt: number;
    goalUsdt: number;
}

const WATCHLIST_STORE = "watchlist";
let RECORD_VERSION = 2;

IndexDbService.registerOnUpgradeNeededListener(result => onUpgradeNeeded(result));

export default {
    setGeneratedArtifactVersion,
    storeTransaction,
    getTransactions,
    getAllTransactions,
    deleteById,
};

function onUpgradeNeeded(result: IDBDatabase) {
    console.log("transactionsDbService > onUpgradeNeeded");
    const objectStores = result.objectStoreNames;

    let store: IDBObjectStore;
    if (!objectStores.contains(WATCHLIST_STORE)) {
        store = result.createObjectStore(WATCHLIST_STORE, {keyPath: "id"});
        store.createIndex("idIndex", "id", {unique: true, multiEntry: false});
        store.createIndex("symbolIndex", "symbol", {unique: false, multiEntry: false});
    }
}

function setGeneratedArtifactVersion(version) {
    RECORD_VERSION = version;
}

async function storeTransaction(transaction: Transaction, purchaseCostUsdt: number, goalUsdt: number) {
    await addTransactionToDb(transaction, purchaseCostUsdt, goalUsdt);
}

async function getTransactions(symbol: string): Promise<Array<StoredTransactionRecord>> {
    return await getTransactionsFromDb(symbol);
}

async function getAllTransactions(): Promise<Array<StoredTransactionRecord>> {
    return await getAllTransactionsFromDb();
}

async function deleteById(id): Promise<void> {
    return new Promise((resolve, reject) => {
        const modelStore = IndexDbService.getObjectStore(WATCHLIST_STORE);
        const index = modelStore.index("idIndex");
        const cursor = index.openKeyCursor(id);
        cursor.onsuccess = function () {
            const cur =  cursor.result;
            if (cur) {
                modelStore.delete(cur.primaryKey);
                cur.continue();
            } else {
                resolve();
            }
        };
        cursor.onerror = function (errorEvent) {
            // TODO need to find out more about the error event
            // @ts-ignore
            reject(errorEvent.target.errorCode);
        };
    });
}

async function addTransactionToDb(transaction: Transaction, purchaseCostUsdt: number, goalUsdt: number): Promise<void> {
    return new Promise((resolve, reject) => {

        let modelRecord: StoredTransactionRecord = {
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

        const modelStore = IndexDbService.getObjectStore(WATCHLIST_STORE);
        const modelRequest = modelStore.put(modelRecord);
        modelRecord = null as never;
        modelRequest.onsuccess = function () {
            resolve();
        };
        modelRequest.onerror = function (errorEvent) {
            reject(extractErrorAsString(`addTransactionToDb indexdb error id=${transaction.id}`, errorEvent));
        };

    });
}

async function getTransactionsFromDb(symbol: string): Promise<Array<StoredTransactionRecord>> {
    return new Promise((resolve, reject) => {
        const store = IndexDbService.getObjectStore(WATCHLIST_STORE);
        const symbolIndex = store.index("symbolIndex");
        const requestHandle = symbolIndex.getAll(symbol);

        requestHandle.onsuccess = function (successEvent) {
            if (typeof (successEvent.target as IDBRequest<StoredTransactionRecord>).result === "undefined") {
                reject();
                return;
            }
            const storedRecord = (successEvent.target as IDBRequest<Array<StoredTransactionRecord>>).result;
            resolve(storedRecord);
        };
        requestHandle.onerror = function (errorEvent) {
            reject(extractErrorAsString(`getTransactionsFromDb indexdb error`,errorEvent));
        };
    });
}

async function getAllTransactionsFromDb(): Promise<Array<StoredTransactionRecord>> {
    return new Promise((resolve, reject) => {
        const store = IndexDbService.getObjectStore(WATCHLIST_STORE);
        const requestHandle = store.getAll();
        
        requestHandle.onsuccess = function (successEvent) {
            if (typeof (successEvent.target as IDBRequest<StoredTransactionRecord>).result === "undefined") {
                reject();
                return;
            }
            const storedRecord = (successEvent.target as IDBRequest<Array<StoredTransactionRecord>>).result;
            resolve(storedRecord);
        };
        requestHandle.onerror = function (errorEvent) {
            reject(extractErrorAsString(`getTransactionsFromDb indexdb error`,errorEvent));
        };
    });
}