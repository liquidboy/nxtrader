import { AssetTransactionsMessage } from "./wallet-lib";
import "dashboard/wallet-peek/loader";
type Props = Readonly<{
    transactions: AssetTransactionsMessage | undefined;
}>;
interface AssetManagerRoute {
    assetTransactionsHidden?: boolean;
    walletPeekHidden?: boolean;
    assetWatchlistEditorHidden?: boolean;
}
export declare function showAssetManagerRoute(routeToShow: AssetManagerRoute): void;
export declare function AssetManager({ transactions }: Props): import("preact").JSX.Element;
export {};
