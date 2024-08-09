define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!dashboard/bot-maintainer/bot-maintainer-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BotMaintainer = void 0;
    function BotMaintainerImpl({ message = "" }) {
        console.log("bot-maintainer > render");
        return (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "oj-sm-margin-7x-start oj-sm-margin-7x-end oj-sm-margin-5x-top" }, { children: message }));
    }
    exports.BotMaintainer = (0, ojvcomponent_1.registerCustomElement)("dashboard-bot-maintainer", BotMaintainerImpl, "BotMaintainer", { "properties": { "message": { "type": "string" } } }, { "message": "" });
});
