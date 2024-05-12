define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "ojs/ojarraydataprovider", "@preact/signals", "css!dashboard/notifications-layer/notifications-layer-styles.css", "ojs/ojmessages"], function (require, exports, jsx_runtime_1, ojvcomponent_1, ArrayDataProvider, signals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNotification = exports.NotificationsLayer = void 0;
    const notifications = (0, signals_1.signal)([]);
    ;
    function NotificationsLayerImpl({}) {
        const dataProvider = new ArrayDataProvider(notifications.value, {
            keyAttributes: "id",
        });
        return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-messages", { class: "oj-color-invert", messages: dataProvider, display: "notification", position: {
                    my: { vertical: 'top', horizontal: 'end' },
                    at: { vertical: 'top', horizontal: 'end' },
                    of: 'window'
                } }) });
    }
    exports.NotificationsLayer = (0, ojvcomponent_1.registerCustomElement)("dashboard-notifications-layer", NotificationsLayerImpl, "NotificationsLayer");
    function createNotification(message) {
        notifications.value = [message];
    }
    exports.createNotification = createNotification;
});
