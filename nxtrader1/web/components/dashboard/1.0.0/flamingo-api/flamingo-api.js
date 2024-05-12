define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!dashboard/flamingo-api/flamingo-api-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlamingoApi = void 0;
    function FlamingoApiImpl({ message = "Hello from  dashboard-flamingo-api" }) {
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.FlamingoApi = (0, ojvcomponent_1.registerCustomElement)("dashboard-flamingo-api", FlamingoApiImpl, "FlamingoApi", { "properties": { "message": { "type": "string" } } }, { "message": "Hello from  dashboard-flamingo-api" });
});
