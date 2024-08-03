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
declare const _default: {
    setGeneratedArtifactVersion: typeof setGeneratedArtifactVersion;
    storeTransaction: typeof storeTransaction;
    getTransactions: typeof getTransactions;
    getAllTransactions: typeof getAllTransactions;
    deleteById: typeof deleteById;
};
export default _default;
declare function setGeneratedArtifactVersion(version: any): void;
declare function storeTransaction(transaction: Transaction, purchaseCostUsdt: number, goalUsdt: number): Promise<void>;
declare function getTransactions(symbol: string): Promise<Array<StoredTransactionRecord>>;
declare function getAllTransactions(): Promise<Array<StoredTransactionRecord>>;
declare function deleteById(id: number): Promise<void>;
