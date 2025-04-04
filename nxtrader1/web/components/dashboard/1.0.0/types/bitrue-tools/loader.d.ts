export { BitrueTools } from "./bitrue-tools";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-bitrue-tools': any;
        }
    }
}
export { BitrueToolsElement } from './bitrue-tools';