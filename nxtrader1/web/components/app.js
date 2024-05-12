define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "./content/index", "ojs/ojcontext", "dashboard/flamingo-api/indexdb/indexDbService"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, index_1, Context, indexDbService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    exports.App = (0, ojvcomponent_1.registerCustomElement)("app-root", ({ appName = "App Name" }) => {
        (0, hooks_1.useEffect)(() => {
            indexDbService_1.default.bootstrapOfflineStorage(true, () => { });
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();
        }, []);
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "appContainer", class: "oj-web-applayout-page" }, { children: (0, jsx_runtime_1.jsx)(index_1.Content, {}) })));
    }, "App", { "properties": { "appName": { "type": "string" } } }, { "appName": "App Name" });
});
