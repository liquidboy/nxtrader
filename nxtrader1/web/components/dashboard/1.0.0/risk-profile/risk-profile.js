define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "dashboard/wallet-manager/wallet-manager", "@preact/signals", "css!dashboard/risk-profile/risk-profile-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, wallet_manager_1, signals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RiskProfile = void 0;
    function RiskProfileImpl(props) {
        (0, signals_1.useSignalEffect)(() => {
            if (wallet_manager_1.walletAssetTotals.value) {
                console.log("risk-profile > useSignalEffect > walletAssetTotals.value", wallet_manager_1.walletAssetTotals.value, props);
            }
        });
        return (0, jsx_runtime_1.jsx)("p", { children: props.high });
    }
    exports.RiskProfile = (0, ojvcomponent_1.registerCustomElement)("dashboard-risk-profile", RiskProfileImpl, "RiskProfile", { "properties": { "low": { "type": "Array<string>" }, "high": { "type": "Array<string>" }, "stables": { "type": "Array<string>" } } });
});
