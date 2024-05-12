define(["require", "exports", "preact/jsx-runtime", "ojs/ojarraydataprovider", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojbutton", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup"], function (require, exports, jsx_runtime_1, ArrayDataProvider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletCharts = void 0;
    function WalletCharts({ chartData }) {
        const chartDataProvider = new ArrayDataProvider(chartData, {
            keyAttributes: "id",
        });
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end" }, { children: [(0, jsx_runtime_1.jsx)("oj-chart", { id: "lineAreaChart", type: "lineWithArea", style: "width:50%;", data: chartDataProvider, "animation-on-display": "auto", "animation-on-data-change": "auto", orientation: "vertical", stack: "on", "hover-behavior": "dim", styleDefaults: { lineType: "centeredStepped", markerDisplayed: "off", lineStyle: "solid" } }), (0, jsx_runtime_1.jsx)("oj-chart", { id: "pieChart", type: "pie", style: "width:50%;", data: chartDataProvider, "animation-on-display": "auto", "animation-on-data-change": "auto", "hover-behavior": "dim" })] })));
    }
    exports.WalletCharts = WalletCharts;
});
