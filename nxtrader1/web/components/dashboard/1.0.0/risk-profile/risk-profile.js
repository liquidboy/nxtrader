define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "dashboard/wallet-manager/wallet-manager", "@preact/signals", "./chart-item", "css!dashboard/risk-profile/risk-profile-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, wallet_manager_1, signals_1, chart_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RiskProfile = void 0;
    function RiskProfileImpl(props) {
        const stablesData = (0, signals_1.useSignal)([]);
        const highRiskData = (0, signals_1.useSignal)([]);
        const mediumRiskData = (0, signals_1.useSignal)([]);
        const lowRiskData = (0, signals_1.useSignal)([]);
        const chartSize = "width:257px; height:200px;";
        (0, signals_1.useSignalEffect)(() => {
            var _a;
            if (wallet_manager_1.walletAssetTotals.value) {
                const assets = (_a = wallet_manager_1.walletAssetTotals.value) === null || _a === void 0 ? void 0 : _a.filter(y => y.groupId[0] === "0");
                const stables = assets === null || assets === void 0 ? void 0 : assets.filter(x => props.stables.includes(x.seriesId.toString()));
                const high = assets === null || assets === void 0 ? void 0 : assets.filter(x => props.high.includes(x.seriesId.toString()));
                const medium = assets === null || assets === void 0 ? void 0 : assets.filter(x => props.medium.includes(x.seriesId.toString()));
                const low = assets === null || assets === void 0 ? void 0 : assets.filter(x => props.low.includes(x.seriesId.toString()));
                console.log("risk-profile > useSignalEffect > walletAssetTotals.value", stables.length, high, medium, low);
                stablesData.value = stables;
                highRiskData.value = high;
                mediumRiskData.value = medium;
                lowRiskData.value = low;
            }
        });
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end oj-md-margin-6x-top" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ style: chartSize, className: "oj-flex-item" }, { children: (0, jsx_runtime_1.jsx)(chart_item_1.ChartItem, { id: "stables", title: "Stables (Near zero risk)", data: stablesData.value, style: chartSize }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: chartSize, className: "oj-flex-item" }, { children: (0, jsx_runtime_1.jsx)(chart_item_1.ChartItem, { id: "low", title: "Low Risk", data: lowRiskData.value, style: chartSize }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: chartSize, className: "oj-flex-item" }, { children: (0, jsx_runtime_1.jsx)(chart_item_1.ChartItem, { id: "medium", title: "Medium Risk", data: mediumRiskData.value, style: chartSize }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: chartSize, className: "oj-flex-item" }, { children: (0, jsx_runtime_1.jsx)(chart_item_1.ChartItem, { id: "high", title: "High Risk", data: highRiskData.value, style: chartSize }) }))] })));
    }
    exports.RiskProfile = (0, ojvcomponent_1.registerCustomElement)("dashboard-risk-profile", RiskProfileImpl, "RiskProfile", { "properties": { "low": { "type": "Array<string>" }, "medium": { "type": "Array<string>" }, "high": { "type": "Array<string>" }, "stables": { "type": "Array<string>" } } });
});
