define(["require", "exports", "preact/jsx-runtime", "dashboard/price-list/price-list", "ojs/ojconverter-number", "dashboard/notifications-layer/notifications-layer", "css!dashboard/watch-list/watch-list-styles.css", "ojs/ojgauge"], function (require, exports, jsx_runtime_1, price_list_1, ojconverter_number_1, notifications_layer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchListItem = void 0;
    const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        currencyFormat: "standard",
        decimalFormat: "long",
        maximumFractionDigits: 2,
    });
    const numberConverter = new ojconverter_number_1.IntlNumberConverter({
        style: "decimal",
        minimumIntegerDigits: 2,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        useGrouping: false,
    });
    const copyValueToClipboard = (value) => {
        navigator.clipboard.writeText(value);
        const newMessage = {
            id: 1,
            severity: 'none',
            summary: value + ' copied to clipboard',
            autoTimeout: 3000,
        };
        (0, notifications_layer_1.createNotification)(newMessage);
    };
    const tooltipRenderer = (ctx) => {
        return { insert: `purchased ⠀(${ctx.componentElement.getAttribute("data-valueSymbol")}) : ${ctx.componentElement.getAttribute("data-value")}
      ⠀⠀⠀⠀⠀⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-purchaseCostUsdt")} 
      current⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-curPriceInUsdt")}
      goal⠀⠀⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-goalUsdt")}` };
    };
    function WatchListItem(item) {
        const unitPriceFound = price_list_1.prices.value.find(p => p.symbol === item.symbol);
        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
        const curPriceInUsdt = parseFloat(item.value) * unitPriceInUsd;
        const purchaseCostUsdt = item.purchaseCostUsdt;
        const goalUsdt = item.goalUsdt;
        const profitInUsdt = curPriceInUsdt - purchaseCostUsdt;
        return ((0, jsx_runtime_1.jsxs)("li", Object.assign({ class: "oj-md-padding-3x-top oj-md-padding-3x-bottom" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-flex oj-text-primary-color oj-typography-body-md" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${item.symbol}.svg`, class: " card-small-token" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ onClick: () => copyValueToClipboard(item.value) }, { children: numberConverter.format(parseFloat(item.value)) })), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-sm-flex-initial oj-flex-item oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/fUSDT.svg`, class: "oj-md-padding-2x-start card-small-token" }), (0, jsx_runtime_1.jsx)("div", { children: usdNumberConverter.format(curPriceInUsdt) }), (0, jsx_runtime_1.jsx)("div", Object.assign({ class: `oj-md-margin-2x-start ${profitInUsdt > 0 ? (profitInUsdt > (goalUsdt - purchaseCostUsdt) ? "profit-above-goal" : "in-profit") : "at-a-loss"}` }, { children: usdNumberConverter.format(profitInUsdt) }))] }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex oj-md-padding-5x-start oj-md-padding-3x-top oj-md-padding-1x-bottom" }, { children: [(0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" }), (0, jsx_runtime_1.jsx)("oj-status-meter-gauge", { "labelled-by": "metricLabel", min: Math.max(0, curPriceInUsdt - 100), max: item.goalUsdt + 50, value: curPriceInUsdt, thresholds: [{ max: purchaseCostUsdt, color: "red" }, { max: goalUsdt, color: "black" }, { color: "green" }], size: "lg", referenceLines: [{ value: purchaseCostUsdt, color: 'red' }, { value: goalUsdt, color: "black" }], tooltip: { renderer: tooltipRenderer }, "data-curPriceInUsdt": curPriceInUsdt, "data-purchaseCostUsdt": purchaseCostUsdt, "data-goalUsdt": goalUsdt, "data-value": item.value, "data-valueSymbol": item.symbol, style: { width: "290px" }, plotArea: { rendered: "on" }, readonly: true }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item" })] }))] })));
    }
    exports.WatchListItem = WatchListItem;
});
