define(["require", "exports", "preact/jsx-runtime", "./wallet-manager", "ojs/ojarraydataprovider", "./wallet-lib"], function (require, exports, jsx_runtime_1, wallet_manager_1, ArrayDataProvider, wallet_lib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletListFilter = void 0;
    function WalletListFilter({}) {
        console.log("wallet-list-filter > render", wallet_manager_1.tagsAsArray.value);
        const tagsDP = new ArrayDataProvider(wallet_manager_1.tagsAsArray.value, {
            keyAttributes: "name",
        });
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: "width: 90%" }, { children: (0, jsx_runtime_1.jsx)("oj-select-many", { labelHint: "filter wallets by tags :", labelEdge: "inside", options: tagsDP, value: wallet_manager_1.selectedTags.value, onvalueChanged: (item) => {
                    if (item.detail.updatedFrom === "internal") {
                        console.log("wallet-list-filter > onvalueChanged", item.detail.updatedFrom, item.detail.previousValue, item.detail.value);
                        wallet_manager_1.selectedTags.value = item.detail.value;
                        (0, wallet_lib_1.saveSelectedTagsToStorage)(item.detail.value);
                    }
                } }) })));
    }
    exports.WalletListFilter = WalletListFilter;
});
