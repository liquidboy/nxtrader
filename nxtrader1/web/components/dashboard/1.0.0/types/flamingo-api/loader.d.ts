export { FlamingoApi } from "./flamingo-api";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-flamingo-api': any;
        }
    }
}
export { FlamingoApiElement } from './flamingo-api';