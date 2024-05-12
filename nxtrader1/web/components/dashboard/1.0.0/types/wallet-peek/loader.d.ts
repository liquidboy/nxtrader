export { WalletPeek } from "./wallet-peek";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-wallet-peek': any;
        }
    }
}
export { WalletPeekElement } from './wallet-peek';