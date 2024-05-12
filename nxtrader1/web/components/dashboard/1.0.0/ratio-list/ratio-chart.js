define(["require", "exports", "preact/jsx-runtime", "@preact/signals", "ojs/ojarraydataprovider", "css!dashboard/ratio-list/ratio-list-styles.css"], function (require, exports, jsx_runtime_1, signals_1, ArrayDataProvider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RatioChart = void 0;
    function RatioChart({ data }) {
        const ratiosHistory = (0, signals_1.useSignal)(data);
        const chartDataProvider = new ArrayDataProvider(ratiosHistory.value, {
            keyAttributes: "id",
        });
        return (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "" }, { children: (0, jsx_runtime_1.jsx)("oj-spark-chart", Object.assign({ type: "lineWithArea", data: chartDataProvider, lineType: "curved", title: "" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: (item) => {
                        return ((0, jsx_runtime_1.jsx)("oj-spark-chart-item", { value: item.data.value }));
                    } }) })) }));
    }
    exports.RatioChart = RatioChart;
});
