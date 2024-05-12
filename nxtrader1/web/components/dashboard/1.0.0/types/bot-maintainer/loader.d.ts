export { BotMaintainer } from "./bot-maintainer";
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-bot-maintainer': any;
        }
    }
}
export { BotMaintainerElement } from './bot-maintainer';