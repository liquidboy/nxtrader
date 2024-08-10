define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "@preact/signals", "./wallet-lib", "./form-elements", "css!dashboard/wallet-manager/wallet-manager-styles.css", "ojs/ojbutton", "ojs/ojactioncard", "ojs/ojcolorspectrum", "ojs/ojlistview", "ojs/ojlistitemlayout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojinputnumber", "ojs/ojselectcombobox"], function (require, exports, jsx_runtime_1, hooks_1, signals_1, wallet_lib_1, form_elements_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletEditor = void 0;
    function WalletEditor({ tryCreate, tryUpdate, clear, close, showAddWallet, refreshAllWalletBalances }) {
        console.log("wallet-editor > init");
        const groupValid = (0, signals_1.signal)(undefined);
        const eatNonNumbers = (event) => {
            let charCode = event.which ? event.which : event.keyCode;
            let char = String.fromCharCode(charCode);
            let replacedValue = char.replace(/[^0-9\.]/g, "");
            if (char !== replacedValue) {
                event.preventDefault();
            }
        };
        (0, hooks_1.useEffect)(() => {
            return (() => {
                console.log("wallet-editor > disposed!!!!!!");
            });
        }, []);
        return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ id: "walletEditor", className: "oj-sm-margin-4x-start oj-sm-padding-3x", hidden: true }, { children: (0, jsx_runtime_1.jsx)("oj-validation-group", Object.assign({ id: "tracker", valid: groupValid.value }, { children: (0, jsx_runtime_1.jsxs)("oj-form-layout", { children: [(0, jsx_runtime_1.jsx)("oj-input-text", { id: "wn", required: true, "label-hint": "wallet name (id)", disabled: form_elements_1.tbnDisabled.value }), (0, jsx_runtime_1.jsx)("oj-input-text", { id: "wdn", "label-hint": "wallet display name", style: { display: form_elements_1.tdnHidden.value ? "none" : "" } }), (0, jsx_runtime_1.jsx)("oj-input-password", { id: "wpk", required: true, "label-hint": "public wallet address", "mask-icon": "visible" }), (0, jsx_runtime_1.jsx)("oj-input-password", { id: "wk", required: false, value: wallet_lib_1.KEY, "label-hint": "key", "mask-icon": "visible", style: "display:none", hidden: true }), (0, jsx_runtime_1.jsx)("oj-input-number", { id: "wg", onKeyPress: eatNonNumbers, labelHint: "Goal (fUSDT)", labelEdge: "inside" }), (0, jsx_runtime_1.jsx)("oj-color-spectrum", { id: "wcol", "label-hint": "wallet color" }), (0, jsx_runtime_1.jsxs)("oj-combobox-many", Object.assign({ id: "wt", class: "oj-form-control-max-width-md", labelEdge: "none", required: true, placeholder: "keywords to tag this wallet with" }, { children: [(0, jsx_runtime_1.jsx)("oj-option", Object.assign({ value: "bot" }, { children: "bot" })), (0, jsx_runtime_1.jsx)("oj-option", Object.assign({ value: "fees" }, { children: "fees" })), (0, jsx_runtime_1.jsx)("oj-option", Object.assign({ value: "flamingo" }, { children: "flamingo" })), (0, jsx_runtime_1.jsx)("oj-option", Object.assign({ value: "personal" }, { children: "personal" }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "oj-flex" }, { children: [(0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butCreate", onojAction: tryCreate, chroming: "callToAction", hidden: form_elements_1.bcrHidden.value }, { children: "Create" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butUpdate", onojAction: tryUpdate, chroming: "callToAction", hidden: form_elements_1.buHidden.value }, { children: "Update" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butClear", onojAction: clear, class: "oj-sm-padding-2x-start", hidden: form_elements_1.bcrHidden.value }, { children: "Clear" })), (0, jsx_runtime_1.jsx)("oj-button", Object.assign({ id: "butClose", onojAction: close, class: "oj-sm-padding-2x-start", hidden: form_elements_1.bcloHidden.value }, { children: "Close" }))] }))] }) })) })) }));
    }
    exports.WalletEditor = WalletEditor;
});
