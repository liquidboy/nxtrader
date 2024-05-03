define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BabylonjsViewer = void 0;
    function BabylonjsViewerImpl({ message = "Hello from  dashboard-babylonjs-viewer" }) {
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.BabylonjsViewer = (0, ojvcomponent_1.registerCustomElement)("dashboard-babylonjs-viewer", BabylonjsViewerImpl, "BabylonjsViewer", { "properties": { "message": { "type": "string" } } }, { "message": "Hello from  dashboard-babylonjs-viewer" });
});
