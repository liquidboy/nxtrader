define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "./footer", "./header", "./content/index"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, Context, footer_1, header_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    exports.App = (0, ojvcomponent_1.registerCustomElement)("app-root", ({ appName = "App Name", userLogin = "jose" }) => {
        (0, hooks_1.useEffect)(() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();
        }, []);
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "appContainer", class: "oj-web-applayout-page" }, { children: [(0, jsx_runtime_1.jsx)(header_1.Header, { appName: appName, userLogin: userLogin }), (0, jsx_runtime_1.jsx)(index_1.Content, {}), (0, jsx_runtime_1.jsx)(footer_1.Footer, {})] })));
    }, "App", { "properties": { "appName": { "type": "string" }, "userLogin": { "type": "string" } } }, { "appName": "App Name", "userLogin": "jose" });
});
