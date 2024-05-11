import { AssetTransactionsMessage } from "./wallet-lib";
import { AssetTransactions } from "./asset-transactions";
import "dashboard/wallet-peek/loader";
import { Signal, computed, signal, useSignal } from "@preact/signals";
import { AssetWatchlistEditor } from "./asset-watchlist";


type Props = Readonly<{
    transactions: AssetTransactionsMessage | undefined; 
}>;

interface AssetManagerRoute {
    assetTransactionsHidden?: boolean;
    walletPeekHidden?: boolean;
    assetWatchlistEditorHidden?: boolean;
};

const defaultRoute : AssetManagerRoute = {
    assetTransactionsHidden: false,
    walletPeekHidden: true,
    assetWatchlistEditorHidden: true
};

const allRoutesHidden : AssetManagerRoute = {
    assetTransactionsHidden: true,
    walletPeekHidden: true,
    assetWatchlistEditorHidden: true
};

const assetManagerRoutes = signal<AssetManagerRoute>(defaultRoute);

export function showAssetManagerRoute(routeToShow: AssetManagerRoute) {
    console.log("asset-manager > showAssetManagerRoute", routeToShow);
    assetManagerRoutes.value = {...allRoutesHidden, ...routeToShow};
}

export function AssetManager(
    { transactions }: Props
) {
    console.log("asset-manager > render"); 

    function gotoAssetTransactions() {
        showAssetManagerRoute({assetTransactionsHidden: false});
    }
    return(<div>
        <AssetTransactions transactions={transactions} hidden={assetManagerRoutes.value.assetTransactionsHidden} ></AssetTransactions>
        <dashboard-wallet-peek navigateBack={gotoAssetTransactions} hiddenRoot={assetManagerRoutes.value.walletPeekHidden}></dashboard-wallet-peek>
        <AssetWatchlistEditor navigateBack={gotoAssetTransactions} hidden={assetManagerRoutes.value.assetWatchlistEditorHidden} ></AssetWatchlistEditor>
    </div>)
}