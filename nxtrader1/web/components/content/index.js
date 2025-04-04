define(["require", "exports", "preact/jsx-runtime", "dashboard/wallet-manager/loader", "dashboard/price-list/loader", "dashboard/ratio-list/loader", "dashboard/notifications-layer/loader", "dashboard/bot-maintainer/loader", "dashboard/wallet-peek/loader", "dashboard/watch-list/loader", "dashboard/flamingo-api/loader", "dashboard/risk-profile/loader", "dashboard/bitrue-tools/loader"], function (require, exports, jsx_runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Content = void 0;
    function Content() {
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-web-applayout-max-width oj-web-applayout-content" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "first-column-content" }, { children: [(0, jsx_runtime_1.jsx)("dashboard-bitrue-tools", {}), (0, jsx_runtime_1.jsx)("dashboard-price-list", { pricesToShow: ['WBTC', 'WETH', 'FLM', 'FLUND', 'bNEO', 'NEO', 'GAS', 'FUSD', 'USDT'] }), (0, jsx_runtime_1.jsx)("dashboard-ratio-list", { ratiosToShow: ['bNEO/WBTC', 'FLM/WBTC', 'GAS/WBTC', 'FLM/bNEO|170/200', 'GAS/bNEO', 'FLM/GAS'] }), (0, jsx_runtime_1.jsx)("dashboard-watch-list", {})] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "oj-flex-item wallet-manager-content" }, { children: [(0, jsx_runtime_1.jsx)("dashboard-wallet-manager", {}), (0, jsx_runtime_1.jsx)("dashboard-bot-maintainer", {}), (0, jsx_runtime_1.jsx)("dashboard-risk-profile", { high: ['FLM', 'FLUND', 'GAS'], medium: ['NEO', 'bNEO', 'WETH'], low: ['WBTC'], stables: ['FUSD', 'USDT'] })] }))] })), (0, jsx_runtime_1.jsx)("dashboard-notifications-layer", {})] })));
    }
    exports.Content = Content;
    ;
});
