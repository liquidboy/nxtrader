import { Transaction } from "./wallet-lib";
import { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";
import "ojs/ojinputnumber";
export declare const seletedTransaction: import("@preact/signals-core").Signal<{
    txDetail: any | undefined;
    transaction: Transaction;
    transactionType: "add" | "edit";
    watchlist: Array<StoredTransactionRecord>;
}>;
type Props = Readonly<{
    hidden: boolean;
    navigateBack: () => void;
}>;
export declare const deleteWatchListItem: (transactionId: number, transactionSymbol: string, transactionValue: any) => Promise<void>;
export declare function AssetWatchlistEditor({ hidden, navigateBack }: Props): import("preact").JSX.Element;
export {};
