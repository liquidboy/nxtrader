define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "dashboard/babylonjs-viewer/loader"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    exports.App = (0, ojvcomponent_1.registerCustomElement)("app-root", ({ version = "1.0.0" }) => {
        (0, hooks_1.useEffect)(() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();
        }, []);
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "appContainer", class: "oj-flex" }, { children: (0, jsx_runtime_1.jsx)("dashboard-babylonjs-viewer", { class: "oj-flex-item" }) })));
    }, "App", { "properties": { "version": { "type": "string" } } }, { "version": "1.0.0" });
});
