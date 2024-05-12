define(["require", "exports", "preact/jsx-runtime", "./asset-transactions", "@preact/signals", "./asset-watchlist", "dashboard/wallet-peek/loader"], function (require, exports, jsx_runtime_1, asset_transactions_1, signals_1, asset_watchlist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetManager = exports.showAssetManagerRoute = void 0;
    ;
    const defaultRoute = {
        assetTransactionsHidden: false,
        walletPeekHidden: true,
        assetWatchlistEditorHidden: true
    };
    const allRoutesHidden = {
        assetTransactionsHidden: true,
        walletPeekHidden: true,
        assetWatchlistEditorHidden: true
    };
    const assetManagerRoutes = (0, signals_1.signal)(defaultRoute);
    function showAssetManagerRoute(routeToShow) {
        console.log("asset-manager > showAssetManagerRoute", routeToShow);
        assetManagerRoutes.value = Object.assign(Object.assign({}, allRoutesHidden), routeToShow);
    }
    exports.showAssetManagerRoute = showAssetManagerRoute;
    function AssetManager({ transactions }) {
        console.log("asset-manager > render");
        function gotoAssetTransactions() {
            showAssetManagerRoute({ assetTransactionsHidden: false });
        }
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(asset_transactions_1.AssetTransactions, { transactions: transactions, hidden: assetManagerRoutes.value.assetTransactionsHidden }), (0, jsx_runtime_1.jsx)("dashboard-wallet-peek", { navigateBack: gotoAssetTransactions, hiddenRoot: assetManagerRoutes.value.walletPeekHidden }), (0, jsx_runtime_1.jsx)(asset_watchlist_1.AssetWatchlistEditor, { navigateBack: gotoAssetTransactions, hidden: assetManagerRoutes.value.assetWatchlistEditorHidden })] }));
    }
    exports.AssetManager = AssetManager;
});
