var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "@preact/signals", "ojs/ojconverter-number", "ojs/ojarraydataprovider", "dashboard/flamingo-api/api/api-client", "css!dashboard/price-list/price-list-styles.css", "ojs/ojlistview", "ojs/ojlistitemlayout"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, signals_1, ojconverter_number_1, ArrayDataProvider, api_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.startPriceRefreshTimer = exports.isAutoPriceRefreshRunning = exports.stopPriceRefreshTimer = exports.PriceList = exports.prices = void 0;
    const FLAMINGO_PRICE_URL = "https://cdn.flamingo.finance/token-info/prices";
    exports.prices = (0, signals_1.signal)([]);
    const refreshEvery5Mins = 300000;
    let refreshTimerId = (0, signals_1.signal)(0);
    const _apiClient = new api_client_1.default();
    function PriceListImpl({ pricesToShow }) {
        const filteredPrices = exports.prices.value.filter(function (x) {
            if (pricesToShow) {
                return pricesToShow.indexOf(x.symbol) >= 0;
            }
            return false;
        });
        const dataProvider = new ArrayDataProvider(filteredPrices !== null && filteredPrices !== void 0 ? filteredPrices : [], {
            keyAttributes: "symbol",
        });
        const usdNumberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencyFormat: "standard",
            decimalFormat: "long",
            maximumFractionDigits: 12,
        });
        const renderItem = (item) => {
            return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex oj-sm-padding-2x" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: `styles/images/${item.item.data.symbol}.svg`, class: "token" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ class: `oj-typography-body-md oj-text-color-primary` }, { children: item.item.data.unwrappedSymbol })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ class: "oj-typography-body-sm oj-text-color-secondary oj-md-padding-2x-start oj-sm-padding-1x-top" }, { children: ["(", item.item.data.symbol, ")"] }))] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { fontSize: 22 } }, { children: usdNumberConverter.format(item.item.data.usd_price) }))] })] })) }));
        };
        (0, hooks_1.useEffect)(() => {
            refreshPrices();
            startPriceRefreshTimer();
            return () => stopPriceRefreshTimer();
        }, []);
        return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-list-view", Object.assign({ id: "lvPrices", "aria-label": "flamingo price list", data: dataProvider, class: "oj-listview-item-padding-off", "selection-mode": "none" }, { children: (0, jsx_runtime_1.jsx)("template", { slot: "itemTemplate", "data-oj-as": "item", render: renderItem }) })) });
    }
    exports.PriceList = (0, ojvcomponent_1.registerCustomElement)("dashboard-price-list", PriceListImpl, "PriceList", { "properties": { "pricesToShow": { "type": "Array<string>" } } });
    function refreshPrices() {
        getFlamingoPriceFeed().then(data => {
            console.log("price-list > refreshPrices > completed", data);
            exports.prices.value = addMissingBNEO(data);
        });
    }
    function getFlamingoPriceFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            return _apiClient.getFlamingoLivedataPricesLatest();
        });
    }
    function addMissingBNEO(data) {
        var neo = data.filter(x => x.symbol === "bNEO");
        if (neo.length === 1) {
            data.push({
                hash: neo[0].hash,
                symbol: "NEO",
                unwrappedSymbol: "NEO",
                usd_price: neo[0].usd_price
            });
        }
        return data;
    }
    function stopPriceRefreshTimer() {
        if (refreshTimerId.value !== 0) {
            console.log("price-list > stop refresh timer");
            clearInterval(refreshTimerId.value);
            refreshTimerId.value = 0;
        }
    }
    exports.stopPriceRefreshTimer = stopPriceRefreshTimer;
    exports.isAutoPriceRefreshRunning = (0, signals_1.computed)(() => refreshTimerId.value > 0);
    function startPriceRefreshTimer() {
        if (refreshTimerId.value === 0) {
            console.log("price-list > start refresh timer");
            refreshTimerId.value = setInterval(refreshPrices, refreshEvery5Mins);
        }
    }
    exports.startPriceRefreshTimer = startPriceRefreshTimer;
});
