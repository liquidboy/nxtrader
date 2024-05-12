import { h } from "preact";
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { wallet as wallet3 } from '@cityofzion/neon-core-neo3';
import "ojs/ojbutton";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import "ojs/ojgauge";
import { ojListView } from "ojs/ojlistview";
import { CWallet } from "./wallet-lib";
type Props = Readonly<{
    wallets: Array<CWallet>;
    walletsMetadata: Map<string, {}>;
    showAddWallet: () => void;
    showEditWallet: (event: any) => void;
    tryDeleteWallet: (event: any) => void;
    walletSelected: (event: ojListView.selectedChanged<{
        keyAttributes: "name";
    }, wallet3.Wallet[]>) => void;
    refreshAllWalletBalances: () => void;
}>;
export declare function WalletList({ wallets, walletsMetadata, showAddWallet, showEditWallet, tryDeleteWallet, walletSelected, refreshAllWalletBalances }: Props): h.JSX.Element;
export declare function refreshLastUpdatedTime(dateNowRefreshed: number): void;
export {};
