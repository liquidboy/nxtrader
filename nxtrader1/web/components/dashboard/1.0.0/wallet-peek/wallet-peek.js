var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "@preact/signals", "dashboard/flamingo-api/api/api-client", "dashboard/flamingo-api/data/tokens", "ojs/ojarraydataprovider", "dashboard/wallet-manager/bignumber", "css!dashboard/wallet-peek/wallet-peek-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, signals_1, api_client_1, tokens_1, ArrayDataProvider, bignumber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletPeek = exports.seletedAddress = void 0;
    const _apiClient = new api_client_1.default();
    exports.seletedAddress = (0, signals_1.signal)(undefined);
    function WalletPeekImpl({ hiddenRoot, navigateBack }) {
        console.log("wallet-peek > render");
        const walletData = (0, signals_1.useSignal)(undefined);
        const walletBalances = (0, signals_1.useSignal)([]);
        const dataProvider = new ArrayDataProvider(walletBalances.value, {
            keyAttributes: "symbol",
        });
        function getAssetBalances() {
            var _a;
            var balances = [];
            if ((_a = walletData.value) === null || _a === void 0 ? void 0 : _a.data) {
                Object.keys(walletData.value.data[0].balances).forEach((k, i) => {
                    const found = (0, tokens_1.findTokenByHash)(tokens_1.default, k, undefined);
                    balances.push({
                        key: k,
                        total: walletData.value.data[0].balances[k],
                        token: found
                    });
                });
            }
            console.log("xxx ", balances);
            return balances;
        }
        (0, signals_1.useSignalEffect)(() => {
            if (exports.seletedAddress.value) {
                console.log("wallet-peek > render > selectedAddress.value changed", exports.seletedAddress.value);
                walletBalances.value = [];
                getWalletDetails(exports.seletedAddress.value).then(result => {
                    console.log("wallet-peek > getWalletDetails", result);
                    walletData.value = result;
                    walletBalances.value = getAssetBalances();
                });
            }
        });
        return (0, jsx_runtime_1.jsxs)("div", Object.assign({ hidden: hiddenRoot, class: "oj-sm-margin-2x" }, { children: [(0, jsx_runtime_1.jsx)("oj-button", Object.assign({ display: "all", onojAction: navigateBack, class: "oj-button-md" }, { children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-back-parent" }) })), (0, jsx_runtime_1.jsx)("div", { children: exports.seletedAddress.value }), (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ "aria-label": "wallet balances", data: dataProvider, class: "oj-listview-item-padding-off", "selection-mode": "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: (item) => {
                            if (item.data.token === undefined)
                                return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "no tokens..." }));
                            return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: item.data.token.symbol }), (0, jsx_runtime_1.jsx)("div", { children: (0, bignumber_1.BigNumber)(item.data.total, 10).shiftedBy(-item.data.token.decimals).toFixed() })] }));
                        } }) }))] }));
    }
    exports.WalletPeek = (0, ojvcomponent_1.registerCustomElement)("dashboard-wallet-peek", WalletPeekImpl, "WalletPeek", { "properties": { "hiddenRoot": { "type": "boolean" }, "message": { "type": "string" }, "navigateBack": { "type": "function" } } });
    function getWalletDetails(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _apiClient.getWalletWalletLatest(address);
            return result;
        });
    }
});
