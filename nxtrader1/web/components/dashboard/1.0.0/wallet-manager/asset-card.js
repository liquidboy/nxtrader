define(["require", "exports", "preact/jsx-runtime", "ojs/ojconverter-number", "ojs/ojcolor", "ojs/ojcolor", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojbutton", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup"], function (require, exports, jsx_runtime_1, ojconverter_number_1, ojcolor_1, Color) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetCard = void 0;
    function AssetCard({ wassetName, wasset, prices, onCardSelected }) {
        if ((wasset === null || wasset === void 0 ? void 0 : wasset.length) === 0)
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
        const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencyFormat: "standard",
            decimalFormat: "long",
            maximumFractionDigits: 12,
        });
        const unitPriceFound = prices.find(p => p.symbol === wassetName);
        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
        const totalPrice = wasset === null || wasset === void 0 ? void 0 : wasset.reduce((a, b) => a + (b.balance ? parseFloat(b.balance) : 0), 0);
        const totalPriceInFUSDT = wasset === null || wasset === void 0 ? void 0 : wasset.reduce((a, b) => a + (b.balance ? parseFloat(b.balance) * unitPriceInUsd : 0), 0);
        function walletAssetSelected(event) {
            var el = event.currentTarget;
            var walletAddress = el.getAttribute("data-walletAddress");
            var assetId = el.getAttribute("data-assetid");
            if (onCardSelected && walletAddress && assetId)
                onCardSelected(walletAddress, wassetName !== null && wassetName !== void 0 ? wassetName : "", assetId, el.id);
        }
        return (0, jsx_runtime_1.jsx)("oj-action-card", Object.assign({ id: "acFUSD", class: "oj-bg-neutral-20 oj-md-margin-2x-end oj-md-margin-2x-bottom" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-margin-3x card-asset" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${wassetName}.svg`, class: "card-token" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-text-primary-color oj-typography-subheading-xs" }, { children: wassetName })), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-text-primary-color oj-typography-subheading-xs" }, { children: totalPrice }))] }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item oj-flex oj-text-secondary-color oj-typography-body-sm oj-sm-padding-4x-top" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "styles/images/fUSDT.svg", class: "card-small-token" }), (0, jsx_runtime_1.jsx)("span", Object.assign({ class: "oj-sm-margin-2x-top" }, { children: usdNumberConverter.format(totalPriceInFUSDT !== null && totalPriceInFUSDT !== void 0 ? totalPriceInFUSDT : 0) }))] }))] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-md-margin-6x-top oj-md-margin-3x-bottom oj-md-margin-3x-start oj-md-margin-3x-end oj-flex" }, { children: wasset === null || wasset === void 0 ? void 0 : wasset.map((asset => {
                            var _a;
                            return ((0, jsx_runtime_1.jsx)("oj-button", Object.assign({ chroming: "borderless", class: "card-wasset", id: `btn-${asset.walletName}-${asset.asset_id}`, "data-walletAddress": asset.walletAddress, "data-assetId": asset.asset_id, onClick: walletAssetSelected }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex card-wasset" }, { children: [(0, jsx_runtime_1.jsx)("div", { style: { width: "5px", height: "35px", backgroundColor: (asset.walletColor ? new Color(asset.walletColor) : ojcolor_1.BLACK).toString() } }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-margin-1x-start" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-text-primary-color oj-typography-body-sm" }, { children: asset.walletName })), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-text-secondary-color oj-typography-body-xs", title: asset.balance }, { children: parseFloat((_a = asset.balance) !== null && _a !== void 0 ? _a : "").toFixed(8) }))] }))] })) })));
                        })) }))] })) }));
    }
    exports.AssetCard = AssetCard;
});
