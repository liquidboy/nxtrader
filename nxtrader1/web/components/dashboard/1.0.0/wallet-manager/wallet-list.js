define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "@preact/signals", "ojs/ojarraydataprovider", "ojs/ojconverter-number", "ojs/ojcolor", "ojs/ojcolor", "dashboard/price-list/price-list", "./wallet-list-filter", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojbutton", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojgauge"], function (require, exports, jsx_runtime_1, hooks_1, signals_1, ArrayDataProvider, ojconverter_number_1, ojcolor_1, Color, price_list_1, wallet_list_filter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.refreshLastUpdatedTime = exports.WalletList = void 0;
    const refreshEvery10Seconds = 10000;
    let lastUpdatedTime = (0, signals_1.signal)(undefined);
    let lastUpdatedTimeLabel = (0, signals_1.signal)(0);
    const isPauseHidden = (0, signals_1.computed)(() => price_list_1.isAutoPriceRefreshRunning.value ? false : true);
    const isPlayHidden = (0, signals_1.computed)(() => price_list_1.isAutoPriceRefreshRunning.value ? true : false);
    function WalletList({ wallets, walletsMetadata, showAddWallet, showEditWallet, tryDeleteWallet, walletSelected, refreshAllWalletBalances }) {
        const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencyFormat: "standard",
            decimalFormat: "long",
            maximumFractionDigits: 12,
        });
        const dataProvider = new ArrayDataProvider(wallets, {
            keyAttributes: "name",
        });
        function getAllWalletsTotal(allWalletsMd) {
            let runningWalletsTotalInUsd = 0;
            let runningGoal = 0;
            allWalletsMd.forEach((a, b) => {
                let rg = 0;
                if (a && 'goal' in a) {
                    rg = a.goal;
                    runningGoal += rg;
                }
                if (a && 'runningWalletTotalInUsd' in a) {
                    const rt = a.runningWalletTotalInUsd;
                    runningWalletsTotalInUsd += rt;
                }
            });
            return { runningWalletsTotalInUsd, runningGoal };
        }
        function renderWallet(item) {
            var _a;
            const walletColor = item.item.data.walletColor ? new Color(item.item.data.walletColor) : ojcolor_1.BLACK;
            const walletColorStyle = {
                width: "5px",
                height: "50px",
                backgroundColor: walletColor.toString()
            };
            const md = walletsMetadata.get(item.key);
            let runningWalletTotal = 0;
            if (md && 'runningWalletTotalInUsd' in md) {
                runningWalletTotal = md.runningWalletTotalInUsd;
            }
            return ((0, jsx_runtime_1.jsx)("li", Object.assign({ style: "align-items:center;" }, { children: (0, jsx_runtime_1.jsxs)("oj-list-item-layout", Object.assign({ style: "width:100%" }, { children: [(0, jsx_runtime_1.jsx)("div", { slot: "leading", style: walletColorStyle }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-typography-body-md oj-text-color-primary" }, { children: item.item.data.name })), (0, jsx_runtime_1.jsx)("div", Object.assign({ slot: "secondary", class: "oj-typography-body-sm oj-text-color-secondary", style: "min-width: 200px;" }, { children: item.item.data.publicKey ? item.item.data.publicKey : item.item.data.accounts[0].label })), (0, jsx_runtime_1.jsx)("div", Object.assign({ slot: "tertiary", class: "oj-flex oj-typography-body-sm oj-text-color-secondary" }, { children: (_a = item.item.data.tags) === null || _a === void 0 ? void 0 : _a.map((item) => {
                                return ((0, jsx_runtime_1.jsx)("div", Object.assign({ class: "tag-item" }, { children: item })));
                            }) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ slot: "metadata", class: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "styles/images/FUSDT.svg", style: { width: "25px" } }), (0, jsx_runtime_1.jsx)("span", Object.assign({ class: "oj-sm-padding-2x-start oj-sm-padding-2x-end oj-sm-padding-6x-top", style: { verticalAlign: "super" } }, { children: usdNumberConverter.format(runningWalletTotal !== null && runningWalletTotal !== void 0 ? runningWalletTotal : 0) })), (0, jsx_runtime_1.jsx)("oj-status-meter-gauge", { "labelled-by": "readOnly", orientation: "circular", min: 0, max: item.item.data.goal, value: runningWalletTotal !== null && runningWalletTotal !== void 0 ? runningWalletTotal : 0, metricLabel: { rendered: "off" }, plotArea: { rendered: "on" }, innerRadius: 0.57, size: "sm", startAngle: 180, angleExtent: 180, class: "oj-sm-padding-3x-top oj-sm-margin-0x", hidden: (item.item.data.goal && item.item.data.goal > 0) ? false : true, readonly: true })] })), (0, jsx_runtime_1.jsx)("div", { slot: "trailing", style: { width: "50px" } }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ slot: "action" }, { children: [(0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "bEdit", display: "icons", onojAction: showEditWallet, class: "oj-button-sm", "row-data": item.item.data.name }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-edit" }), "Edit"] })), (0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "bDelete", display: "icons", onojAction: tryDeleteWallet, class: "oj-button-sm oj-sm-padding-2x-start", "row-data": item.item.data.name }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-trash" }), "Delete"] }))] }))] })) })));
        }
        function renderTotal(md) {
            var _a, _b;
            return ((0, jsx_runtime_1.jsxs)("oj-list-item-layout", Object.assign({ id: "lilFooter", style: "" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(wallet_list_filter_1.WalletListFilter, {}) }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ slot: "metadata", class: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "styles/images/FUSDT.svg", style: { width: "25px" } }), (0, jsx_runtime_1.jsx)("span", Object.assign({ class: "oj-sm-padding-2x-start oj-sm-padding-2x-end oj-sm-padding-6x-top", style: { verticalAlign: "super" } }, { children: usdNumberConverter.format((_a = md.runningWalletsTotalInUsd) !== null && _a !== void 0 ? _a : 0) })), (0, jsx_runtime_1.jsx)("oj-status-meter-gauge", { "labelled-by": "readOnly", orientation: "circular", min: 0, max: md.runningGoal, value: (_b = md.runningWalletsTotalInUsd) !== null && _b !== void 0 ? _b : 0, metricLabel: { rendered: "off" }, plotArea: { rendered: "on" }, innerRadius: 0.57, size: "sm", startAngle: 180, angleExtent: 180, class: "oj-sm-padding-3x-top oj-sm-margin-0x", readonly: true })] })), (0, jsx_runtime_1.jsx)("div", { slot: "trailing", style: { width: "50px" } }), (0, jsx_runtime_1.jsx)("div", { slot: "action", style: { width: "52px" } })] })));
        }
        (0, hooks_1.useEffect)(() => {
            const timerId = setInterval(refreshLastUpdatedLabel, refreshEvery10Seconds);
            return () => clearInterval(timerId);
        }, []);
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end" }, { children: [(0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "butAddWallet", display: "all", onojAction: showAddWallet, class: "oj-button-sm" }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-plus" }), "Add Wallet"] })), (0, jsx_runtime_1.jsx)("span", { className: "oj-flex-item" }), (0, jsx_runtime_1.jsxs)("span", Object.assign({ class: "oj-sm-padding-2x-end oj-sm-padding-4x-top oj-text-color-secondary" }, { children: ["last updated ", lastUpdatedTimeLabel, " second(s) ago"] })), (0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "butRefreshBalances", display: "icons", hidden: true, onojAction: refreshAllWalletBalances, class: "oj-button-sm oj-sm-flex-initial oj-flex-item  oj-sm-margin-2x-end" }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-refresh" }), "Refresh wallet balances"] })), (0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "butPause", display: "icons", onojAction: price_list_1.stopPriceRefreshTimer, class: "oj-button-sm oj-sm-flex-initial oj-flex-item", hidden: isPauseHidden.value }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-pause" }), "Pause autorefresh"] })), (0, jsx_runtime_1.jsxs)("oj-button", Object.assign({ id: "butPlay", display: "icons", onojAction: price_list_1.startPriceRefreshTimer, class: "oj-button-sm oj-sm-flex-initial oj-flex-item", hidden: isPlayHidden.value }, { children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-play" }), "Start autorefresh (runs every 60 seconds)"] }))] })), (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvWallets", "aria-label": "wallets", data: dataProvider, gridlines: { item: "visible" }, class: "oj-sm-padding-3x-top oj-sm-padding-3x-start oj-sm-padding-3x-end", selectionMode: "none", onselectedChanged: walletSelected }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: renderWallet }) })), (0, jsx_runtime_1.jsx)("ul", { children: renderTotal(getAllWalletsTotal(walletsMetadata)) })] }));
    }
    exports.WalletList = WalletList;
    function refreshLastUpdatedLabel() {
        console.log("wallet-list > refreshLastUpdatedLabel");
        var diff = Math.abs(Date.now() - lastUpdatedTime.peek());
        var diffInSeconds = Math.floor((diff / 1000));
        lastUpdatedTimeLabel.value = diffInSeconds;
    }
    function refreshLastUpdatedTime(dateNowRefreshed) {
        console.log("wallet-list > refreshLastUpdatedLabelNow");
        lastUpdatedTime.value = dateNowRefreshed;
        refreshLastUpdatedLabel();
    }
    exports.refreshLastUpdatedTime = refreshLastUpdatedTime;
});
