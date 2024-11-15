define(["require", "exports", "preact/jsx-runtime", "ojs/ojarraydataprovider"], function (require, exports, jsx_runtime_1, ArrayDataProvider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartItem = void 0;
    function ChartItem(props) {
        const chartDataProvider = new ArrayDataProvider(props.data, {
            keyAttributes: "id",
        });
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("oj-chart", Object.assign({ id: props.id, type: "pyramid", data: chartDataProvider, "animation-on-display": "auto", "animation-on-data-change": "auto", legend: { rendered: "off" }, style: props.style }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: (item) => {
                            return ((0, jsx_runtime_1.jsx)("oj-chart-item", { value: item.data.value, groupId: item.data.groupId, seriesId: item.data.seriesId }));
                        } }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: "text-align:center" }, { children: props.title }))] }));
    }
    exports.ChartItem = ChartItem;
});
