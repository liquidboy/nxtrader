import { h } from "preact";
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import "ojs/ojbutton";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import { AssetTransactionsMessage } from "./wallet-lib";
type Props = Readonly<{
    hidden: boolean;
    transactions: AssetTransactionsMessage | undefined;
}>;
export declare function AssetTransactions({ hidden, transactions }: Props): h.JSX.Element;
export declare function getTimeInterval(date: number): string;
export {};
