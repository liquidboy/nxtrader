export { NotificationsLayer } from "./notifications-layer";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-notifications-layer': any;
        }
    }
}
export { NotificationsLayerElement } from './notifications-layer';