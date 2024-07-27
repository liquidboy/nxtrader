var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "@preact/signals", "ojs/ojcolor", "./asset-card", "./wallet-lib", "./wallet-list", "./wallet-charts", "./wallet-editor", "dashboard/price-list/price-list", "dashboard/notifications-layer/notifications-layer", "ojs/ojcolor", "./asset-manager", "dashboard/flamingo-api/indexdb/transactionsDbService", "./form-elements", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojchart", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojpopup", "ojs/ojdrawerpopup"], function (require, exports, jsx_runtime_1, ojvcomponent_1, signals_1, ojcolor_1, asset_card_1, wallet_lib_1, wallet_list_1, wallet_charts_1, wallet_editor_1, price_list_1, notifications_layer_1, Color, asset_manager_1, transactionsDbService_1, form_elements_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getWallet = exports.WalletManager = exports.wallets = exports.walletsRaw = exports.selectedTags = exports.tagsAsArray = exports.tags = void 0;
    const refreshEvery1Minute = 60000;
    let refreshIntervalId = undefined;
    const useCacheing = false;
    const cacheAddressBalances = new Map();
    exports.tags = (0, signals_1.signal)(new Set());
    exports.tagsAsArray = (0, signals_1.computed)(() => Array.from(exports.tags.value).map((x) => ({ "name": x, "value": x })));
    let tempIds = (0, wallet_lib_1.getSelectedTagsFromStorage)();
    exports.selectedTags = (0, signals_1.signal)(tempIds);
    exports.walletsRaw = (0, signals_1.signal)([]);
    exports.wallets = (0, signals_1.computed)(() => {
        if (exports.selectedTags.value.length === 0)
            return exports.walletsRaw.value;
        let found = exports.walletsRaw.value.filter(w => {
            var found = false;
            w.tags.forEach(t => {
                var found2 = exports.selectedTags.value.includes(t);
                if (found2)
                    found = true;
            });
            return found;
        });
        console.log("wallet-manager > wallets > computed");
        return found;
    });
    function updateWallets(force, postUpdateWallets) {
        const existingWallets = (0, wallet_lib_1.loadWalletsFromStorage)();
        console.log("wallet-manager > updateWallets");
        if (force || existingWallets && existingWallets.length > 0) {
            exports.walletsRaw.value = existingWallets;
            if (postUpdateWallets)
                postUpdateWallets();
        }
    }
    function updateWalletsDelayed(interval = 1000) {
        setTimeout(updateWallets, interval);
    }
    function WalletManagerImpl() {
        const walletsMetadata = (0, signals_1.useSignal)(new Map());
        const walletAssetTotals = (0, signals_1.useSignal)([]);
        const currentTransactions = (0, signals_1.useSignal)(undefined);
        const aFUSDT = (0, signals_1.useSignal)([]);
        const aFUSD = (0, signals_1.useSignal)([]);
        const aNEO = (0, signals_1.useSignal)([]);
        const aGAS = (0, signals_1.useSignal)([]);
        const aFLM = (0, signals_1.useSignal)([]);
        const aBTC = (0, signals_1.useSignal)([]);
        const aETH = (0, signals_1.useSignal)([]);
        const aFLUND = (0, signals_1.useSignal)([]);
        (0, signals_1.useSignalEffect)(() => {
            if (price_list_1.prices.value && price_list_1.prices.value.length > 0) {
                console.log("wallet-manager > useSignalEffect > prices changed");
                console.log("wallet-manager > useSignalEffect > wallets changed");
                updateWallets(false, () => {
                    console.log("wallet-manager > useSignalEffect > updateWallets > callback");
                    refreshAllWalletBalances();
                    (0, wallet_list_1.refreshLastUpdatedTime)(Date.now());
                    const fe = getFormElements();
                    form_elements_1.brbHidden.value = exports.wallets.value.length === 0;
                });
            }
        });
        function getFormElements() {
            const lvw = document.getElementById('lvWallets');
            const wcol = document.getElementById('wcol');
            const wg = document.getElementById('wg');
            const wn = document.getElementById('wn');
            const wpk = document.getElementById('wpk');
            const wk = document.getElementById('wk');
            const tracker = document.getElementById('tracker');
            const we = document.getElementById('walletEditor');
            const wt = document.getElementById('wt');
            const de = document.getElementById('de');
            const dat = document.getElementById('dat');
            return { wcol, wn, wpk, wk, tracker, lvw, we, wg, wt, de, dat };
        }
        function tryCreate() {
            var _a;
            if (isFormValid()) {
                const fe = getFormElements();
                if (fe.wn.value && fe.wpk.value && fe.wk.value) {
                    (0, wallet_lib_1.addWalletToStorage)(fe.wn.value, fe.wpk.value, fe.wk.value, fe.wg.value, (_a = fe.wcol.value) === null || _a === void 0 ? void 0 : _a.toString(), fe.wt.value);
                    close();
                    updateWalletsDelayed();
                    form_elements_1.brbHidden.value = false;
                }
            }
        }
        function tryUpdate() {
            var _a;
            const fe = getFormElements();
            if (isFormValid() && fe.wn.value) {
                (0, wallet_lib_1.updateWalletToStorage)(fe.wn.value, fe.wpk.value, fe.wg.value, (_a = fe.wcol.value) === null || _a === void 0 ? void 0 : _a.toString(), fe.wt.value);
                close();
                updateWalletsDelayed();
            }
        }
        function tryDeleteWallet(event) {
            const wk = event.srcElement.attributes["row-data"].value;
            (0, wallet_lib_1.deleteWalletFromStorage)(wk);
            const newMessage = {
                id: 1,
                severity: 'none',
                summary: `wallet "${wk}" deleted`,
                autoTimeout: 3000,
            };
            (0, notifications_layer_1.createNotification)(newMessage);
            updateWallets(true);
        }
        function clear() {
            const fe = getFormElements();
            fe.wn.value = "";
            fe.wpk.value = "";
            fe.wk.value = wallet_lib_1.KEY;
            form_elements_1.bcrHidden.value = false;
            form_elements_1.bclrHidden.value = false;
            form_elements_1.buHidden.value = true;
            form_elements_1.bcloHidden.value = false;
            fe.wcol.value = ojcolor_1.BLACK;
            fe.wg.value = 0;
            fe.wt.value = [];
        }
        function clearWalletsState() {
            aFUSDT.value = [];
            aFUSD.value = [];
            aNEO.value = [];
            aGAS.value = [];
            aFLM.value = [];
            aBTC.value = [];
            aETH.value = [];
            aFLUND.value = [];
            walletsMetadata.value.clear();
            walletAssetTotals.value = [];
        }
        function close() {
            const fe = getFormElements();
            clear();
            fe.we.hidden = true;
            form_elements_1.bawHidden.value = false;
            fe.de.opened = false;
            (0, price_list_1.startPriceRefreshTimer)();
        }
        function isFormValid() {
            const fe = getFormElements();
            if (fe.tracker.valid === 'valid') {
                return true;
            }
            else {
                fe.tracker.showMessages();
                fe.tracker.focusOn('@firstInvalidShown');
                return false;
            }
        }
        function walletSelected(event) {
            return __awaiter(this, void 0, void 0, function* () {
                const fe = getFormElements();
                if (event.detail.items === null) {
                    clear();
                    fe.we.hidden = true;
                    form_elements_1.bawHidden.value = false;
                    return;
                }
            });
        }
        function assetSelected(walletAddress, asset_name, assetId, sourceElementId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (assetId) {
                    const fe = getFormElements();
                    fe.dat.opened = true;
                    (0, price_list_1.stopPriceRefreshTimer)();
                    currentTransactions.value = { transactions: [], watchlist: [], asset_name, assetId, walletAddress };
                    var result = yield (0, wallet_lib_1.getN3AssetTxs)(walletAddress, assetId);
                    var watchlistFound = yield transactionsDbService_1.default.getTransactions(asset_name);
                    currentTransactions.value = { transactions: result, watchlist: watchlistFound, asset_name, assetId, walletAddress };
                }
            });
        }
        function refreshAllTags() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("wallet-manager > refreshAllTags", exports.wallets);
                const runningTags = new Set();
                for (let index = 0; index < exports.walletsRaw.value.length; index++) {
                    const w = exports.walletsRaw.value[index];
                    w.tags.forEach(x => runningTags.add(x));
                }
                ;
                exports.tags.value = runningTags;
            });
        }
        function refreshAllWalletBalances() {
            return __awaiter(this, void 0, void 0, function* () {
                clearWalletsState();
                console.log("wallet-manager > refreshAllWalletBalances", exports.wallets);
                for (let index = 0; index < exports.wallets.value.length; index++) {
                    const w = exports.wallets.value[index];
                    const publicKey = w.publicKey ? w.publicKey : w.accounts[0].label;
                    let assets;
                    if (useCacheing) {
                        const foundInCache = cacheAddressBalances.get(publicKey);
                        if (foundInCache) {
                            const dt1 = new Date(foundInCache.age);
                            let dif = dt1.getTime() - Date.now();
                            let difInSecs = Math.abs(dif / 1000);
                            if (difInSecs < 300) {
                                assets = foundInCache.data;
                            }
                            else {
                                assets = undefined;
                                cacheAddressBalances.delete(publicKey);
                            }
                        }
                    }
                    if (assets === undefined) {
                        assets = yield (0, wallet_lib_1.getN3AddressBalances)(publicKey);
                        if (useCacheing)
                            cacheAddressBalances.set(publicKey, { data: assets, age: Date.now() });
                    }
                    let runningWalletTotalInUsd = 0;
                    assets.forEach(a => {
                        if (price_list_1.prices.value && a.balance && a.balance !== "0") {
                            let unitPriceFound = price_list_1.prices.value.find(p => p.symbol === a.symbol);
                            ;
                            switch (a.symbol) {
                                case "fUSDT":
                                    aFUSDT.value = [...aFUSDT.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "FUSD":
                                    aFUSD.value = [...aFUSD.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "NEO":
                                    aNEO.value = [...aNEO.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    unitPriceFound = price_list_1.prices.value.find(p => p.symbol === "bNEO");
                                    break;
                                case "bNEO":
                                    aNEO.value = [...aNEO.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    unitPriceFound = price_list_1.prices.value.find(p => p.symbol === "bNEO");
                                    break;
                                case "GAS":
                                    aGAS.value = [...aGAS.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "FLM":
                                    aFLM.value = [...aFLM.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "fWBTC":
                                    aBTC.value = [...aBTC.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "fWETH":
                                    aETH.value = [...aETH.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                case "FLUND":
                                    aFLUND.value = [...aFLUND.value, Object.assign(Object.assign({}, a), { walletAddress: publicKey, walletName: w.name, walletColor: w.walletColor })];
                                    break;
                                default: console.log(a.symbol);
                            }
                            const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
                            runningWalletTotalInUsd += parseFloat(a.balance) * unitPriceInUsd;
                        }
                    });
                    walletsMetadata.value.set(w.name, { runningWalletTotalInUsd, goal: w.goal });
                    const newTotals = [];
                    function addNewTotal(assetName, asset) {
                        const unitPriceFound = price_list_1.prices.value.find(p => p.symbol === assetName);
                        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
                        const totalInUsd = asset === null || asset === void 0 ? void 0 : asset.reduce((a, b) => a + (b.balance ? parseFloat(b.balance) * unitPriceInUsd : 0), 0);
                        newTotals.push({
                            "id": newTotals.length,
                            "seriesId": assetName,
                            "groupId": "0",
                            "value": totalInUsd
                        });
                        newTotals.push({
                            "id": newTotals.length,
                            "seriesId": assetName,
                            "groupId": "1",
                            "value": totalInUsd
                        });
                        return totalInUsd !== null && totalInUsd !== void 0 ? totalInUsd : 0;
                    }
                    addNewTotal("FUSD", aFUSD.value);
                    addNewTotal("fUSDT", aFUSDT.value);
                    addNewTotal("GAS", aGAS.value);
                    addNewTotal("bNEO", aNEO.value);
                    addNewTotal("FLM", aFLM.value);
                    addNewTotal("fWBTC", aBTC.value);
                    addNewTotal("fWETH", aETH.value);
                    addNewTotal("FLUND", aFLUND.value);
                    walletAssetTotals.value = newTotals;
                }
                ;
                refreshAllTags();
            });
        }
        function showEditWallet(event) {
            const wk = event.srcElement.attributes["row-data"].value;
            const w = exports.wallets.value.find(x => x.name === wk);
            if (w) {
                const w3 = w.accounts[0];
                const fe = getFormElements();
                console.log("wallet-manager > showEditWallet", w);
                fe.we.hidden = false;
                fe.wn.value = w.name;
                fe.wpk.value = w.publicKey ? w.publicKey : w3._WIF;
                fe.wg.value = w.goal;
                fe.wcol.value = w.walletColor ? new Color(w.walletColor) : ojcolor_1.BLACK;
                form_elements_1.bcrHidden.value = true;
                form_elements_1.bclrHidden.value = true;
                form_elements_1.buHidden.value = false;
                form_elements_1.bcloHidden.value = false;
                form_elements_1.bawHidden.value = true;
                fe.wt.value = w.tags;
                fe.de.opened = true;
                (0, price_list_1.stopPriceRefreshTimer)();
            }
        }
        function showAddWallet() {
            clear();
            const fe = getFormElements();
            fe.we.hidden = false;
            form_elements_1.bawHidden.value = true;
            fe.de.opened = true;
            (0, price_list_1.stopPriceRefreshTimer)();
        }
        return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("oj-drawer-popup", Object.assign({ id: "dat", edge: "end", class: "drawerAssetTransactions", onojBeforeClose: close, onopenedChanged: (item) => {
                        if (item.detail.value === true) {
                            (0, asset_manager_1.showAssetManagerRoute)({ assetTransactionsHidden: false });
                        }
                        ;
                    } }, { children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(asset_manager_1.AssetManager, { transactions: currentTransactions.value }) }) })), (0, jsx_runtime_1.jsx)("oj-drawer-popup", Object.assign({ id: "de", edge: "start", class: "drawerEditor", onojBeforeClose: close }, { children: (0, jsx_runtime_1.jsx)(wallet_editor_1.WalletEditor, { tryCreate: tryCreate, tryUpdate: tryUpdate, clear: clear, close: close, showAddWallet: showAddWallet, refreshAllWalletBalances: refreshAllWalletBalances }) })), (0, jsx_runtime_1.jsx)(wallet_list_1.WalletList, { wallets: exports.wallets.value, walletsMetadata: walletsMetadata.value, walletSelected: walletSelected, tryDeleteWallet: tryDeleteWallet, showAddWallet: showAddWallet, showEditWallet: showEditWallet, refreshAllWalletBalances: refreshAllWalletBalances }), (0, jsx_runtime_1.jsx)(wallet_charts_1.WalletCharts, { chartData: walletAssetTotals.value }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end oj-sm-margin-5x-top" }, { children: [(0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "FUSD", wasset: aFUSD.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "fUSDT", wasset: aFUSDT.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "FLM", wasset: aFLM.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "FLUND", wasset: aFLUND.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "bNEO", wasset: aNEO.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "GAS", wasset: aGAS.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "fWBTC", wasset: aBTC.value, prices: price_list_1.prices.value, onCardSelected: assetSelected }), (0, jsx_runtime_1.jsx)(asset_card_1.AssetCard, { wassetName: "fWETH", wasset: aETH.value, prices: price_list_1.prices.value, onCardSelected: assetSelected })] }))] });
    }
    exports.WalletManager = (0, ojvcomponent_1.registerCustomElement)("dashboard-wallet-manager", WalletManagerImpl, "WalletManager");
    function getWallet(address) {
        for (let index = 0; index < exports.wallets.value.length; index++) {
            const w = exports.wallets.value[index];
            if (w.publicKey === address)
                return w;
        }
    }
    exports.getWallet = getWallet;
});
