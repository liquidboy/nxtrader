var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojconverter-number", "ojs/ojcolor", "./wallet-lib", "ojs/ojarraydataprovider", "dashboard/notifications-layer/notifications-layer", "dashboard/price-list/price-list", "./asset-manager", "dashboard/wallet-peek/wallet-peek", "./wallet-manager", "ojs/ojcolor", "./asset-watchlist", "dashboard/flamingo-api/api/api-client", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojbutton", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup"], function (require, exports, jsx_runtime_1, ojconverter_number_1, ojcolor_1, wallet_lib_1, ArrayDataProvider, notifications_layer_1, price_list_1, asset_manager_1, wallet_peek_1, wallet_manager_1, Color, asset_watchlist_1, api_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTimeInterval = exports.AssetTransactions = void 0;
    const _apiClient = new api_client_1.default();
    function AssetTransactions({ hidden, transactions }) {
        if (transactions === undefined)
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "none found ..." });
        console.log("asset-transactions > render", transactions);
        const wallet = (0, wallet_manager_1.getWallet)(transactions.walletAddress);
        const dataProvider = new ArrayDataProvider(transactions.transactions, {
            keyAttributes: "id",
        });
        const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencyFormat: "standard",
            decimalFormat: "long",
            maximumFractionDigits: 12,
        });
        const unitPriceFound = price_list_1.prices.value.find(p => p.symbol === transactions.asset_name);
        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
        const copyValueToClipboard = (value) => {
            navigator.clipboard.writeText(value);
            const newMessage = {
                id: 1,
                severity: 'none',
                summary: value + ' copied to clipboard',
                autoTimeout: 3000,
            };
            (0, notifications_layer_1.createNotification)(newMessage);
        };
        const peekAddress = (value) => {
            (0, asset_manager_1.showAssetManagerRoute)({ walletPeekHidden: false });
            wallet_peek_1.seletedAddress.value = value;
        };
        const showAddAssetToWatchList = (value) => __awaiter(this, void 0, void 0, function* () {
            (0, asset_manager_1.showAssetManagerRoute)({ assetWatchlistEditorHidden: false });
            let tx = yield _apiClient.getNeoTransaction(value.txid);
            console.log("xxx tx", tx);
            asset_watchlist_1.seletedTransaction.value = { txDetail: tx, transaction: value, transactionType: "add", watchlist: [] };
        });
        const showEditAssetToWatchList = (value) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, asset_manager_1.showAssetManagerRoute)({ assetWatchlistEditorHidden: false });
            let tx = yield _apiClient.getNeoTransaction(value.txid);
            asset_watchlist_1.seletedTransaction.value = { txDetail: tx, transaction: value, transactionType: "edit", watchlist: (_a = transactions.watchlist) === null || _a === void 0 ? void 0 : _a.filter(x => x.id === value.id) };
        });
        return (0, jsx_runtime_1.jsxs)("div", Object.assign({ hidden: hidden }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-sm-padding-5x-start oj-sm-padding-5x-end oj-sm-padding-2x-top" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-flex-item" }, { children: [(0, jsx_runtime_1.jsx)("div", { style: { width: "5px", height: "27px", backgroundColor: (wallet.walletColor ? new Color(wallet.walletColor) : ojcolor_1.BLACK).toString() } }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-padding-1x-top oj-sm-padding-1x-start oj-sm-padding-2x-end" }, { children: [wallet.name, " > "] })), (0, jsx_runtime_1.jsx)("img", { src: `styles/images/${transactions.asset_name}.svg`, class: "card-small-token" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-sm-padding-1x-top oj-sm-padding-0x-start oj-sm-padding-2x-end" }, { children: transactions.asset_name }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item " }, { children: [transactions.transactions.length, " ", transactions.transactions.length > 1 ? "transactions" :
                                    transactions.transactions.length === 1 ? "transaction" : ""] }))] })), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvTransactions", "aria-label": "transactions", data: dataProvider, gridlines: { item: "visible" }, class: "oj-sm-padding-1x", selectionMode: "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: (item) => {
                                var _a, _b;
                                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-flex oj-text-primary-color oj-typography-body-md" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${item.data.symbol}.svg`, class: " card-small-token" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex-item", style: { width: "200px" } }, { children: [item.data.value, (0, jsx_runtime_1.jsx)("span", { class: "oj-md-padding-2x-start oj-ux-ico-clipboard-add clipboard-action", title: "copy price to clipboard", onClick: () => copyValueToClipboard(item.data.value) })] })), item.data.value > 0 ?
                                                    (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex-item oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "styles/images/fUSDT.svg", class: "card-small-token" }), (0, jsx_runtime_1.jsx)("div", { children: usdNumberConverter.format(parseFloat(item.data.value) * unitPriceInUsd) })] })) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item oj-flex oj-text-secondary-color" }, { children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-bookmark clipboard-action", title: "add to watch list", hidden: item.data.type === "sent"
                                                                || (((_a = transactions.watchlist) === null || _a === void 0 ? void 0 : _a.filter(x => x.id === item.data.id).length) > 0), onClick: () => showAddAssetToWatchList(item.data) }), (0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-bookmark-selected clipboard-action", title: "remove from watch list", hidden: ((_b = transactions.watchlist) === null || _b === void 0 ? void 0 : _b.filter(x => x.id === item.data.id).length) !== 1, onClick: () => showEditAssetToWatchList(item.data) })] }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm" }, { children: [item.data.type === "sent" ? "sent to " : "recieved from ", (0, jsx_runtime_1.jsxs)("span", Object.assign({ class: "clipboard-action tx-address", title: "peek into address", onClick: () => peekAddress(item.data.type === "sent" ? item.data.to[0] : item.data.from[0]) }, { children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-wallet oj-md-margin-1x-end oj-md-margin-1x-top" }), item.data.type === "sent" ? (0, wallet_lib_1.addressFormat)(item.data.to[0]) : (0, wallet_lib_1.addressFormat)(item.data.from[0])] })), (0, jsx_runtime_1.jsx)("span", { class: "oj-md-padding-2x-start oj-sm-padding-2x-top  oj-ux-ico-clipboard-add clipboard-action", title: "copy address to clipboard", onClick: () => copyValueToClipboard(item.data.type === "sent" ? item.data.to[0] : item.data.from[0]) })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm" }, { children: [getTimeInterval(item.data.block_time * 1000), " (", new Date(item.data.block_time * 1000).toISOString(), ")"] }))] }));
                            } }) })) })] }));
    }
    exports.AssetTransactions = AssetTransactions;
    function getTimeInterval(date) {
        let seconds = Math.floor((Date.now() - date) / 1000);
        let unit = "second";
        let direction = "ago";
        if (seconds < 0) {
            seconds = -seconds;
            direction = "from now";
        }
        let value = seconds;
        if (seconds >= 31536000) {
            value = Math.floor(seconds / 31536000);
            unit = "year";
        }
        else if (seconds >= 86400) {
            value = Math.floor(seconds / 86400);
            unit = "day";
        }
        else if (seconds >= 3600) {
            value = Math.floor(seconds / 3600);
            unit = "hour";
        }
        else if (seconds >= 60) {
            value = Math.floor(seconds / 60);
            unit = "minute";
        }
        if (value != 1)
            unit = unit + "s";
        return value + " " + unit + " " + direction;
    }
    exports.getTimeInterval = getTimeInterval;
});
