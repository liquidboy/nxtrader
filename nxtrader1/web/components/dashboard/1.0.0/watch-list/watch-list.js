define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "dashboard/flamingo-api/indexdb/transactionsDbService", "@preact/signals", "ojs/ojarraydataprovider", "dashboard/price-list/price-list", "./watch-list-item", "css!dashboard/watch-list/watch-list-styles.css", "ojs/ojgauge"], function (require, exports, jsx_runtime_1, ojvcomponent_1, transactionsDbService_1, signals_1, ArrayDataProvider, price_list_1, watch_list_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchList = void 0;
    function WatchListImpl() {
        console.log("watch-list > render");
        const watchlist = (0, signals_1.useSignal)([]);
        const dataProvider = new ArrayDataProvider(watchlist.value, {
            keyAttributes: "id",
        });
        (0, signals_1.useSignalEffect)(() => {
            if (price_list_1.prices.value && price_list_1.prices.value.length > 0) {
                tryLoadTransactions();
            }
            ;
        });
        function tryLoadTransactions() {
            setTimeout(() => {
                transactionsDbService_1.default.getAllTransactions().then(result => {
                    watchlist.value = result.sort((x, y) => x.value - y.value);
                });
            }, 1000);
        }
        return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvWatchlist", "aria-label": "transactions", data: dataProvider, gridlines: { item: "hidden" }, class: "oj-sm-padding-2x", selectionMode: "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: item => (0, watch_list_item_1.WatchListItem)(item.data) }) })) });
    }
    exports.WatchList = (0, ojvcomponent_1.registerCustomElement)("dashboard-watch-list", WatchListImpl, "WatchList");
});
