define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "./ratios-lib", "@preact/signals", "./ratio-chart", "ojs/ojarraydataprovider", "dashboard/price-list/price-list", "css!dashboard/ratio-list/ratio-list-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, ratios_lib_1, signals_1, ratio_chart_1, ArrayDataProvider, price_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RatioList = void 0;
    function RatioListImpl({ ratiosToShow }) {
        const maxHistoryNodes = 500;
        const ratiosHistory = (0, signals_1.useSignal)(new Map());
        const ratios = (0, signals_1.useSignal)([]);
        const listDataProvider = (0, signals_1.computed)(() => new ArrayDataProvider(ratios.value, {
            keyAttributes: "key",
        }));
        function getLatestRatios() {
            var _a;
            console.log("ratio-list > getLatestRatios");
            function findPrice(symbol) {
                const filteredPrices = price_list_1.prices.value.filter(function (x) {
                    if (symbol === x.symbol) {
                        return true;
                    }
                });
                return filteredPrices;
            }
            const newRatios = [];
            if (price_list_1.prices && ((_a = price_list_1.prices === null || price_list_1.prices === void 0 ? void 0 : price_list_1.prices.value) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                ratiosToShow === null || ratiosToShow === void 0 ? void 0 : ratiosToShow.forEach(v => {
                    const ratioParts = v.split("|");
                    const partsA = ratioParts[0].split("/");
                    const price1 = findPrice(partsA[0]);
                    const price2 = findPrice(partsA[1]);
                    const ratio = price1[0].usd_price / price2[0].usd_price;
                    const ratioInvert = price2[0].usd_price / price1[0].usd_price;
                    let buySell = "";
                    if (ratioParts[1] != undefined) {
                        const partsB = ratioParts[1].split("/");
                        if (ratioInvert <= parseFloat(partsB[0])) {
                            buySell = `👴 ${partsA[0]} is strong, convert ${partsA[0]} to ${partsA[1]}`;
                        }
                        else if (ratioInvert >= parseFloat(partsB[1])) {
                            buySell = `👴 ${partsA[1]} is strong, convert ${partsA[1]} to ${partsA[0]}`;
                        }
                    }
                    newRatios.push({ key: ratioParts[0], p1: partsA[0], p2: partsA[1], ratio, ratioInvert, buySell });
                });
            }
            if (newRatios.length > 0) {
                (0, ratios_lib_1.addToRatiosInStorage)(Date.now().toString(), newRatios);
                ratios.value = newRatios;
                getChartData();
            }
        }
        function getChartData() {
            var ratios2 = (0, ratios_lib_1.loadRatiosFromStorage)();
            var cdd = new Map();
            ratios2.forEach((v, k) => {
                v.forEach(ri => {
                    var _a;
                    if (!cdd.has(ri.key)) {
                        cdd.set(ri.key, []);
                    }
                    (_a = cdd.get(ri.key)) === null || _a === void 0 ? void 0 : _a.push({
                        id: parseInt(k),
                        seriesId: ri.key,
                        groupId: k,
                        value: ri.ratioInvert,
                        buySell: ri.buySell
                    });
                });
            });
            cdd.forEach((v, k) => {
                cdd.set(k, v.slice(0, Math.min(maxHistoryNodes, v.length)));
            });
            ratiosHistory.value = cdd;
        }
        (0, signals_1.useSignalEffect)(() => {
            if (price_list_1.prices.value) {
                getLatestRatios();
            }
        });
        return (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-sm-margin-3x-top " }, { children: (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvRatios", "aria-label": "flamingo price list", data: listDataProvider.value, class: "oj-listview-item-padding-off", "selection-mode": "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: (item) => {
                        var _a;
                        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-md-margin-2x-top oj-md-padding-2x-start oj-md-padding-2x-end oj-md-margin-6x-bottom" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-md-padding-2x-bottom oj-typography-body-lg oj-text-color-primary" }, { children: item.data.key })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-md-margin-2x-bottom" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${item.item.data.p1}.svg`, class: "card-small-token" }), (0, jsx_runtime_1.jsx)("img", { src: `styles/images/${item.item.data.p2}.svg`, class: "card-small-token" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-sm-padding-1x-start" }, { children: item.item.data.ratioInvert }))] })), (0, jsx_runtime_1.jsx)(ratio_chart_1.RatioChart, { data: (_a = ratiosHistory.value.get(item.data.key)) !== null && _a !== void 0 ? _a : [] }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-md-padding-2x-top" }, { children: item.item.data.buySell }))] })));
                    } }) })) }));
    }
    exports.RatioList = (0, ojvcomponent_1.registerCustomElement)("dashboard-ratio-list", RatioListImpl, "RatioList", { "properties": { "ratiosToShow": { "type": "Array<string>" } } });
});
