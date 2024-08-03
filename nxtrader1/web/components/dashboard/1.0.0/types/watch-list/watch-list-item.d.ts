import "css!dashboard/watch-list/watch-list-styles.css";
import { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";
import 'ojs/ojgauge';
import { ojButtonEventMap } from "@oracle/oraclejet/ojbutton";
export declare function WatchListItem(item: StoredTransactionRecord, deleteItenAction: (value: ojButtonEventMap<any>["ojAction"]) => void): import("preact").JSX.Element;
