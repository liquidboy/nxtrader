export { RatioList } from "./ratio-list";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-ratio-list': any;
        }
    }
}
export { RatioListElement } from './ratio-list';