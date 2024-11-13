var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "dashboard/flamingo-api/indexdb/transactionsDbService", "@preact/signals", "ojs/ojarraydataprovider", "dashboard/price-list/price-list", "./watch-list-item", "dashboard/wallet-manager/asset-watchlist", "css!dashboard/watch-list/watch-list-styles.css", "ojs/ojgauge"], function (require, exports, jsx_runtime_1, ojvcomponent_1, transactionsDbService_1, signals_1, ArrayDataProvider, price_list_1, watch_list_item_1, asset_watchlist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchList = exports.tryLoadTransactionsInWatchlist = void 0;
    const watchlist = (0, signals_1.signal)([]);
    function tryLoadTransactionsInWatchlist() {
        setTimeout(() => {
            transactionsDbService_1.default.getAllTransactions().then(result => {
                function conv(s) {
                    const unitPriceFound = price_list_1.prices.value.find(p => p.symbol === s.symbol);
                    const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
                    const curPriceInUsdt = parseFloat(s.value) * unitPriceInUsd;
                    const purchaseCostUsdt = s.purchaseCostUsdt;
                    const goalUsdt = s.goalUsdt;
                    const profitInUsdt = curPriceInUsdt - purchaseCostUsdt;
                    return Object.assign(Object.assign({}, s), { profitInUsdt, curPriceInUsdt, unitPriceInUsd });
                }
                const r2 = result.map((x, y) => conv(x));
                watchlist.value = r2.sort((x, y) => y.profitInUsdt - x.profitInUsdt);
            });
        }, 1000);
    }
    exports.tryLoadTransactionsInWatchlist = tryLoadTransactionsInWatchlist;
    function tryDeleteWatchListItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = event.srcElement.dataset.id;
            const symbol = event.srcElement.dataset.symbol;
            const val = event.srcElement.dataset.value;
            yield (0, asset_watchlist_1.deleteWatchListItem)(parseInt(id), symbol, val);
            tryLoadTransactionsInWatchlist();
        });
    }
    function WatchListImpl() {
        console.log("watch-list > render", watchlist.value);
        const dataProvider = new ArrayDataProvider(watchlist.value, {
            keyAttributes: "id",
        });
        (0, signals_1.useSignalEffect)(() => {
            if (price_list_1.prices.value && price_list_1.prices.value.length > 0) {
                tryLoadTransactionsInWatchlist();
            }
            ;
        });
        return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvWatchlist", "aria-label": "transactions", data: dataProvider, gridlines: { item: "hidden" }, class: "oj-sm-padding-2x", selectionMode: "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: item => (0, watch_list_item_1.WatchListItem)(item.data, tryDeleteWatchListItem) }) })) });
    }
    exports.WatchList = (0, ojvcomponent_1.registerCustomElement)("dashboard-watch-list", WatchListImpl, "WatchList");
});
