export { ConnectedWallet } from "./connected-wallet";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-connected-wallet': any;
        }
    }
}
export { ConnectedWalletElement } from './connected-wallet';