export { BabylonjsViewer } from "./babylonjs-viewer";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-babylonjs-viewer': any;
        }
    }
}
export { BabylonjsViewerElement } from './babylonjs-viewer';