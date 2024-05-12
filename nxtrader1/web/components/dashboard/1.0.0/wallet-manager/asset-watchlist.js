var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "@preact/signals", "./wallet-lib", "dashboard/flamingo-api/indexdb/transactionsDbService", "dashboard/notifications-layer/notifications-layer", "dashboard/watch-list/watch-list-item", "ojs/ojconverter-number", "dashboard/price-list/price-list", "./asset-transactions", "ojs/ojinputnumber"], function (require, exports, jsx_runtime_1, signals_1, wallet_lib_1, transactionsDbService_1, notifications_layer_1, watch_list_item_1, ojconverter_number_1, price_list_1, asset_transactions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetWatchlistEditor = exports.seletedTransaction = void 0;
    exports.seletedTransaction = (0, signals_1.signal)(undefined);
    function AssetWatchlistEditor({ hidden, navigateBack }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        console.log("asset-watchlist > AssetWatchlistEditor");
        const unitPriceFound = price_list_1.prices.value.find(p => { var _a; return p.symbol === ((_a = exports.seletedTransaction.value) === null || _a === void 0 ? void 0 : _a.transaction.symbol); });
        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
        const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencyFormat: "standard",
            decimalFormat: "long",
            maximumFractionDigits: 12,
        });
        const addToWatchList = () => __awaiter(this, void 0, void 0, function* () {
            console.log("asset-transactions > addToWatchList", exports.seletedTransaction.value);
            const tc = document.getElementById('tc');
            const tg = document.getElementById('tg');
            yield transactionsDbService_1.default.storeTransaction(exports.seletedTransaction.value.transaction, tc.value, tg.value);
            const newMessage = {
                id: 2,
                severity: 'none',
                summary: `${exports.seletedTransaction.value.transaction.symbol} ${exports.seletedTransaction.value.transaction.value} added to watch list`,
                autoTimeout: 2000,
            };
            (0, notifications_layer_1.createNotification)(newMessage);
            navigateBack();
        });
        const updateInWatchList = () => __awaiter(this, void 0, void 0, function* () {
            const tc = document.getElementById('tc');
            const tg = document.getElementById('tg');
            yield transactionsDbService_1.default.storeTransaction(exports.seletedTransaction.value.transaction, tc.value, tg.value);
            const newMessage = {
                id: 2,
                severity: 'none',
                summary: `${exports.seletedTransaction.value.transaction.symbol} ${exports.seletedTransaction.value.transaction.value} updated in watch list`,
                autoTimeout: 2000,
            };
            (0, notifications_layer_1.createNotification)(newMessage);
            navigateBack();
        });
        const deleteFromWatchList = () => __awaiter(this, void 0, void 0, function* () {
            yield transactionsDbService_1.default.deleteById(exports.seletedTransaction.value.transaction.id);
            const newMessage = {
                id: 2,
                severity: 'none',
                summary: `${exports.seletedTransaction.value.transaction.symbol} ${exports.seletedTransaction.value.transaction.value} deleted from watch list`,
                autoTimeout: 2000,
            };
            (0, notifications_layer_1.createNotification)(newMessage);
            navigateBack();
        });
        const foundInWatchlist = ((_a = exports.seletedTransaction.value) === null || _a === void 0 ? void 0 : _a.watchlist.length) === 1 ? exports.seletedTransaction.value.watchlist[0] : undefined;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ hidden: hidden, class: "oj-sm-margin-2x" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("oj-button", Object.assign({ display: "all", onojAction: navigateBack, class: "oj-button-md" }, { children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-back-parent" }) })), (0, jsx_runtime_1.jsx)("h6", Object.assign({ class: "oj-sm-margin-4x-start" }, { children: ((_b = exports.seletedTransaction.value) === null || _b === void 0 ? void 0 : _b.watchlist.length) === 1 ? "Edit existing item in watchlist" : "Add to watchlist" }))] })), (0, jsx_runtime_1.jsx)("div", { children: ((_c = exports.seletedTransaction.value) === null || _c === void 0 ? void 0 : _c.txDetail) ? (_d = exports.seletedTransaction.value) === null || _d === void 0 ? void 0 : _d.txDetail.index : "loading txdetail" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-margin-3x-top oj-md-margin-5x-bottom" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-flex oj-text-primary-color oj-typography-body-md" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${(_e = exports.seletedTransaction.value) === null || _e === void 0 ? void 0 : _e.transaction.symbol}.svg`, class: " card-small-token" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-flex-item" }, { children: (_f = exports.seletedTransaction.value) === null || _f === void 0 ? void 0 : _f.transaction.value })), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" }), ((_g = exports.seletedTransaction.value) === null || _g === void 0 ? void 0 : _g.transaction.value) > 0 ?
                                            (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "styles/images/FUSDT.svg", class: "card-small-token" }), (0, jsx_runtime_1.jsx)("div", { children: usdNumberConverter.format(parseFloat((_h = exports.seletedTransaction.value) === null || _h === void 0 ? void 0 : _h.transaction.value) * unitPriceInUsd) })] })) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm" }, { children: [((_j = exports.seletedTransaction.value) === null || _j === void 0 ? void 0 : _j.transaction.type) === "sent" ? "sent to " : "recieved from ", (0, jsx_runtime_1.jsxs)("span", Object.assign({ class: "clipboard-action tx-address", title: "peek into address" }, { children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-wallet oj-md-margin-1x-end oj-md-margin-1x-top" }), ((_k = exports.seletedTransaction.value) === null || _k === void 0 ? void 0 : _k.transaction.type) === "sent" ? (0, wallet_lib_1.addressFormat)((_l = exports.seletedTransaction.value) === null || _l === void 0 ? void 0 : _l.transaction.to[0]) : (0, wallet_lib_1.addressFormat)((_m = exports.seletedTransaction.value) === null || _m === void 0 ? void 0 : _m.transaction.from[0])] }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm" }, { children: [(0, asset_transactions_1.getTimeInterval)(((_o = exports.seletedTransaction.value) === null || _o === void 0 ? void 0 : _o.transaction.block_time) * 1000), "(", exports.seletedTransaction.value ? new Date(((_p = exports.seletedTransaction.value) === null || _p === void 0 ? void 0 : _p.transaction.block_time) * 1000).toISOString() : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), ")"] }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-margin-5x-start" }, { children: [(0, jsx_runtime_1.jsx)("oj-input-number", { id: "tc", labelHint: "Purchase Cost (fUSDT)", labelEdge: "inside", value: foundInWatchlist ? foundInWatchlist.purchaseCostUsdt : null, class: "oj-sm-padding-1x-top" }), (0, jsx_runtime_1.jsx)("oj-input-number", { id: "tg", labelHint: "Goal (fUSDT)", labelEdge: "inside", value: foundInWatchlist ? foundInWatchlist.goalUsdt : null, class: "oj-sm-padding-1x-top" })] }))] }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-md-margin-5x-top oj-md-margin-3x-bottom" }, { children: (0, jsx_runtime_1.jsx)("ul", Object.assign({ style: "list-style-type: none;" }, { children: ((_q = exports.seletedTransaction.value) === null || _q === void 0 ? void 0 : _q.watchlist.length) === 1 ? (0, watch_list_item_1.WatchListItem)(exports.seletedTransaction.value.watchlist[0]) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-sm-padding-4x-top" }, { children: [(0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item" }, { children: [(0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butCancel", chroming: "outlined", onojAction: navigateBack }, { children: "cancel" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butCreate", chroming: "callToAction", class: "oj-sm-margin-2x-start", onojAction: addToWatchList, hidden: ((_r = exports.seletedTransaction.value) === null || _r === void 0 ? void 0 : _r.transactionType) === "edit" }, { children: "create" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butUpdate", chroming: "callToAction", class: "oj-sm-margin-2x-start", onojAction: updateInWatchList, hidden: ((_s = exports.seletedTransaction.value) === null || _s === void 0 ? void 0 : _s.transactionType) === "add" }, { children: "update" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butDelete", chroming: "danger", class: "oj-sm-margin-2x-start", onojAction: deleteFromWatchList, hidden: ((_t = exports.seletedTransaction.value) === null || _t === void 0 ? void 0 : _t.transactionType) === "add" }, { children: "delete" }))] }))] }))] })));
    }
    exports.AssetWatchlistEditor = AssetWatchlistEditor;
});
