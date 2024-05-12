export { WatchList } from "./watch-list";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-watch-list': any;
        }
    }
}
export { WatchListElement } from './watch-list';