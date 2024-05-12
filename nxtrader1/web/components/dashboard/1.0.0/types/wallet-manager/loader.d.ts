export { WalletManager } from "./wallet-manager";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-wallet-manager': any;
        }
    }
}
export { WalletManagerElement } from './wallet-manager';