export { RiskProfile } from "./risk-profile";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-risk-profile': any;
        }
    }
}
export { RiskProfileElement } from './risk-profile';