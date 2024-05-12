export { PriceList } from "./price-list";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-price-list': any;
        }
    }
}
export { PriceListElement } from './price-list';