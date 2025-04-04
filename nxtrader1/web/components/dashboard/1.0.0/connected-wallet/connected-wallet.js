define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!dashboard/connected-wallet/connected-wallet-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConnectedWallet = void 0;
    function ConnectedWalletImpl({ message = "NEO ❤️ FLM" }) {
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.ConnectedWallet = (0, ojvcomponent_1.registerCustomElement)("dashboard-connected-wallet", ConnectedWalletImpl, "ConnectedWallet", { "properties": { "message": { "type": "string" } } }, { "message": "NEO \u2764\uFE0F FLM" });
});
